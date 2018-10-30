import { ILightnessParams, ISaturationParams } from "../../dataCore/paramsInterface/paramsInterface";

export default abstract class DataCore {
  public abstract getComputedImageData(imageData: ImageData, params:
    ILightnessParams | ISaturationParams): Promise<ImageData>;
}
