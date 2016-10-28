import { IBundleLoader, Bundle, IBundleContent } from "@tandem/sandbox/bundle";
import { JS_MIME_TYPE } from "@tandem/common";

class WebpackLoaderContext {

  public options = {
    target: "web"
  };

  public minimize: boolean = false;
  public sourceMap: boolean = true;

  public resourcePath: string;

  constructor(
    readonly bundle: Bundle,
    readonly currentContent: IBundleContent
  ) {

    this.resourcePath = bundle.filePath;
  }

  cacheable() {

  }

  async() {
    throw new Error(`Async is not supported yet.`);
  }
}

export function createWebpackBundleLoaderClass(webpackLoader: Function, contentMimeType?: string): { new(): IBundleLoader } {

  class WebpackBundleLoader implements IBundleLoader {
    async load(bundle: Bundle, currentContent: IBundleContent) {
      return new Promise<IBundleContent>((resolve) => {
        const context    = new WebpackLoaderContext(bundle, currentContent);
        const newContent = webpackLoader.call(context, currentContent.content);
        resolve({
          type: JS_MIME_TYPE,
          content: newContent
        });
      }).catch((err) => {
        console.error(err.stack);
      });
    }
  };

  return WebpackBundleLoader;
}