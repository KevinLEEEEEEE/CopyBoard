interface IPassParams {
  imageData: ImageData;
  isChanged: boolean;
}

const enum componentsType {
  brightness,
}

class Pipeline {
  private pipeFlow: symbol[] = [];
  private pipeLut: object = {};
  private parentNode: HTMLElement;
  private passParams: IPassParams;

  constructor(parentNode: HTMLElement) {
    this.parentNode = parentNode;

    this.passParams = { imageData: null, isChanged: false };
  }

  public setImageData(imageData: ImageData) {
    this.passParams = {
      imageData,
      isChanged: true,
    };
  }

  public init(): void {

  }

  public delete(): void {

  }

  private async runPipeline(passParams): Promise<ImageData> {
    const outputData = await this.pipeFlow.reduce((prev, current) => {
      const { component } = this.pipeLut[current];

      return prev.then((value) => component.run(value));
    }, passParams);

    // this.cleanDeletedComponents(); // run after pipeline to ensure the "changed;

    return outputData;
  }
}

export {
  Pipeline,
  componentsType,
};
