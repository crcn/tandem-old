import { Browser, Page, launch } from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import * as fsa from "fs-extra";
import { fork, take, call, put, select, spawn } from "redux-saga/effects";
import { loadModuleDependencyGraph, defaultResolveModulePath, loadModuleAST, parseModuleSource } from "paperclip";
import { SCREENSHOTS_DIRECTORY } from "../constants";
import { ApplicationState, ScreenshotClippings, AllComponentsPreviewEntry } from "../state";
import { FILE_CONTENT_CHANGED, FileContentChanged, headlessBrowserLaunched, componentScreenshotTaken, componentScreenshotSaved, ComponentScreenshotRemoved, ComponentScreenshotSaved, componentScreenshotRemoved, ComponentScreenshotTaken, HEADLESS_BROWSER_LAUNCHED, COMPONENT_SCREENSHOT_TAKEN, COMPONENT_SCREENSHOT_SAVED, componentScreenshotStarted } from "../actions";
import { isPaperclipFile, getModuleFilePaths, getAllModules, getAssocComponents, getComponentPreviewUrl, getAllModuleComponents, getComponentsFromSourceContent, getAvailableComponents, getPreviewComponentEntries, getAllComponentsPreviewUrl } from "../utils";

export function* screenshotsSaga() {
  yield fork(handleTakingScreesnshots);
  yield fork(handleNewScreenshot);
  yield fork(handleSavedScreenshot);
  yield fork(cleanupOldScreenshots);

  // last thing to launch
  yield fork(openHeadlessBrowser);
}

const MAX_SCREENSHOTS = 10;

function* openHeadlessBrowser() {
  console.log("Opening headless chrome browser");
  const browser: Browser = yield call(launch);
  yield put(headlessBrowserLaunched(browser))
}

function* takeAssocScreenshots(filePath: string) {
  const state: ApplicationState = yield select();
  const assocComponents = yield call(getAssocComponents, filePath, state);
}

function* handleTakingScreesnshots() {
  yield take(HEADLESS_BROWSER_LAUNCHED);
  while(true) {
    
    yield call(takeComponentScreenshot);

    const state: ApplicationState = yield select();

    // happens during a screenshot
    if (!state.shouldTakeAnotherScreenshot) {
      yield take(FILE_CONTENT_CHANGED);
    }
  }
}

const getAllComponentsPreviewSize = (entries: AllComponentsPreviewEntry[]) => ({
  width: entries.reduce((a, b) => Math.max(a, b.bounds.right), 0),
  height: entries.reduce((a, b) => Math.max(a, b.bounds.bottom), 0)
});

function* takeComponentScreenshot() {
  const state: ApplicationState = yield select();

  yield put(componentScreenshotStarted());
  try {

    const entries = getPreviewComponentEntries(state);

    console.log(`Taking screenshot of ${entries.length} components...`);

    const clippings: ScreenshotClippings = {};
    for (const entry of entries) {
      clippings[entry.targetComponentId] = entry.bounds;
    }

    const previewUrl = getAllComponentsPreviewUrl(state)
    const browser = state.headlessBrowser;
    const page: Page = yield call(browser.newPage.bind(browser));
    yield call(page.goto.bind(page), previewUrl);
    yield call(page.setViewport.bind(page), getAllComponentsPreviewSize(entries));

    const buffer = yield call(page.screenshot.bind(page, { type: "png" }));
    yield put(componentScreenshotTaken(buffer, clippings, "image/png"));

    page.close();
  } catch(e) {
    console.error(e.stack);
  }
}

function* handleNewScreenshot() {
  while(true) {
    const { contentType, buffer, clippings }: ComponentScreenshotTaken = yield take(COMPONENT_SCREENSHOT_TAKEN);

    // for now -- use mime type look up eventually
    if (contentType !== "image/png") {
      throw new Error(`Unsupported image type ${contentType}.`);
    }

    const filePath = path.join(SCREENSHOTS_DIRECTORY, `${Date.now()}.png`);

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

    console.log(`Saved components screenshot ${filePath}`);

    yield put(componentScreenshotSaved(filePath, clippings));
    
  }
}

function* handleSavedScreenshot() {
  while(true) {
    yield take(COMPONENT_SCREENSHOT_SAVED);
    const state: ApplicationState = yield select();
    const screenshots = [...state.componentScreenshots];
    if (screenshots.length > MAX_SCREENSHOTS) {

      // should always be one, but we use delta just in case
      const delta = screenshots.length - MAX_SCREENSHOTS;

      // Just in case, show a warning.
      if (delta > 1) {
        console.warn(`delta for MAX_SCREENSHOTS exceeds 2. There's probably a bug somewhere else in the app.`);
      }

      for (let i = delta; i--;) {
        const { uri } = screenshots.shift();
        console.log(`Removing old screenshot ${uri}`);
        fsa.unlinkSync(uri);
        yield put(componentScreenshotRemoved(uri));
      }
    }
  }
}

function* cleanupOldScreenshots() {
  console.log("Cleaning up screenshots directory");
  try {
    fsa.emptyDirSync(SCREENSHOTS_DIRECTORY);
    fsa.rmdirSync(SCREENSHOTS_DIRECTORY);
  } catch(e) {
    console.warn(`Cannot cleaup directory ${SCREENSHOTS_DIRECTORY}: `, e);
  }

  fsa.mkdirpSync(SCREENSHOTS_DIRECTORY);
}