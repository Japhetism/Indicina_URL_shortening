import { successResponseMessage, errorResponseMessage } from "../constants"

export class ResponseHelper {
  
  public static success(data: any) {
    return {
      message: successResponseMessage,
      data: data,
    }
  }

  public static error(errorMessage: string, data: any = null) {
    return {
      message: errorResponseMessage,
      error: errorMessage,
      data: data
    }
  }
}