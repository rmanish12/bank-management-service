export const getSuccessResponse = (message: string) => {
  return {
    status: "SUCCESS",
    message,
    timeStamp: new Date()
  }
}