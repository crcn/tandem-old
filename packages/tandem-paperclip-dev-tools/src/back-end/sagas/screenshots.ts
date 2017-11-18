import { Browser, Page, launch } from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import * as fsa from "fs-extra";
import { fork, take, call, put, select, spawn } from "redux-saga/effects";
import { loadModuleDependencyGraph, defaultResolveModulePath, loadModuleAST, parseModuleSource } from "paperclip";
import { SCREENSHOTS_DIRECTORY } from "../constants";
import { ApplicationState, getComponentsFromSourceContent, getAvailableComponents } from "../state";
import { FILE_CONTENT_CHANGED, FileContentChanged, headlessBrowserLaunched, componentScreenshotTaken, componentScreenshotSaved, ComponentScreenshotRemoved, ComponentScreenshotSaved, componentScreenshotRemoved, ComponentScreenshotTaken, HEADLESS_BROWSER_LAUNCHED, COMPONENT_SCREENSHOT_TAKEN, COMPONENT_SCREENSHOT_SAVED, COMPONENT_SCREENSHOT_REQUESTED, componentScreenshotStarted, componentScreenshotRequested } from "../actions";
import { isPaperclipFile, getModuleFilePaths, getAllModules, getAssocComponents, getComponentPreviewUrl, getAllModuleComponents } from "../utils";

export function* screenshotsSaga() {
  yield fork(handleComponentScreenshotRequests);
  yield fork(handleComponentChange);
  yield fork(handleNewScreenshot);
  yield fork(handleSavedScreenshot);
  yield fork(cleanupOldScreenshots);
  yield fork(handleInitialScreenshots);

  // last thing to launch
  yield fork(openHeadlessBrowser);
}

const MAX_SCREENSHOTS = 10;

function* openHeadlessBrowser() {
  console.log("Opening headless chrome browser");
  const browser: Browser = yield call(launch);
  yield put(headlessBrowserLaunched(browser))
}

function* handleComponentChange() {
  yield take(HEADLESS_BROWSER_LAUNCHED);
  while(true) {
    try {
      const action: FileContentChanged = yield take(FILE_CONTENT_CHANGED);
      if (isPaperclipFile(action.filePath, yield select())) {
        yield takeAssocScreenshots(action.filePath);
      }
    } catch(e) {
      console.error(e.stack);
    }
  }
}

function* handleInitialScreenshots() {
  yield take(HEADLESS_BROWSER_LAUNCHED);
  const state: ApplicationState = yield select();
  const allComponents = getAllModuleComponents(state);
  console.log(`Taking screenshots of ${allComponents.length} components`);
  for (const component of allComponents) {
    yield put(componentScreenshotRequested(component.id));
  }
}

function* takeAssocScreenshots(filePath: string) {
  const state: ApplicationState = yield select();
  const assocComponents = yield call(getAssocComponents, filePath, state);
  for (const componentId in assocComponents) {
    yield put(componentScreenshotRequested(componentId));
  }
}


function* handleComponentScreenshotRequests() {
  while(true) {
    yield take(COMPONENT_SCREENSHOT_REQUESTED);
    const state: ApplicationState = yield select();
    for (const componentId of state.componentScreenshotQueue) {
      yield spawn(takeComponentScreenshot, componentId);
    }
  }
}

function* takeComponentScreenshot(componentId: string) {
  yield put(componentScreenshotStarted(componentId));
  const state: ApplicationState = yield select();
  const previewUrl = getComponentPreviewUrl(componentId, state)
  const browser = state.headlessBrowser;

  const page: Page = yield call(browser.newPage.bind(browser));
  yield call(page.goto.bind(page), previewUrl);
  const buffer = yield call(page.screenshot.bind(page));

  yield put(componentScreenshotTaken(componentId, buffer, "image/jpeg"));

  page.close();
}

function* handleNewScreenshot() {
  while(true) {
    const { contentType, buffer, componentId }: ComponentScreenshotTaken = yield take(COMPONENT_SCREENSHOT_TAKEN);

    // for now -- use mime type look up eventually
    if (contentType !== "image/jpeg") {
      throw new Error(`Unsupported image type ${contentType}.`);
    }

    const filePath = path.join(SCREENSHOTS_DIRECTORY, `${componentId}-${Date.now()}.jpg`);

    console.log(`Saving component ${componentId} screenshot to tmp directory ${filePath}`);

    try {
      yield call(() => new Promise((resolve, reject) => {
        fs.writeFile(filePath, buffer, (err) => {
          if (err) return reject(err);
          resolve();
        });
      }));
    } catch(e) {

      // shouldn't happen, but if it does...
      console.error("Unable to save screenshot: ", e);
      continue;
    }

    yield put(componentScreenshotSaved(componentId, filePath));
    
  }
}

function* handleSavedScreenshot() {
  while(true) {
    const { componentId }: ComponentScreenshotSaved = yield take(COMPONENT_SCREENSHOT_SAVED);
    const state: ApplicationState = yield select();
    const screenshots = [...state.componentScreenshots[componentId]];
    if (screenshots.length > MAX_SCREENSHOTS) {

      // should always be one, but we use delta just in case
      const delta = MAX_SCREENSHOTS - screenshots.length;

      // Just in case, show a warning.
      if (delta > 1) {
        console.warn(`delta for MAX_SCREENSHOTS exceeds 2. There's probably a bug somewhere else in the app.`);
      }

      for (let i = delta; i--;) {
        const uri = screenshots.shift();
        console.log(`Removing old screenshot ${uri}`);
        fsa.unlinkSync(uri);
        yield put(componentScreenshotRemoved(componentId, uri));
      }
    }
  }
}

function* cleanupOldScreenshots() {
  console.log("Cleaning up screenshots directory");
  try {
    fsa.rmdirSync(SCREENSHOTS_DIRECTORY);
  } catch(e) {

  }

  fsa.mkdirpSync(SCREENSHOTS_DIRECTORY);
}