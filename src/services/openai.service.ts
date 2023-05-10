import { LOGGER } from "../common/logger";
import { Configuration,OpenAIApi } from "openai";
import AuthSettings from "./storage.service";
import { ExtensionContext } from "vscode";
import * as vscode from 'vscode';
import { validateAPIKey } from "../util";

const getConfiguration = async (context:ExtensionContext) => {
  AuthSettings.init(context);
  // Retrieves the API key from the AuthSettings instance.
  const apiKey = await AuthSettings.instance.getAuthData("OPENAI_API_KEY");
  // If the API key is not found, an error message is displayed.
  if(!validateAPIKey(apiKey)){
    vscode.window.showErrorMessage("Please enter a valid API key by using setup Environment Variable Command.");
  }
  // returns a Configuration object
  return new Configuration({apiKey:apiKey});
};


export const getCommentedCode = async (code: string, context:ExtensionContext) => {
  try {
    const openai = new OpenAIApi(await getConfiguration(context));
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Give me improved code with better comments. ${code}`,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      max_tokens: 2090,
      temperature: 0
    });
    LOGGER.info(response);
    return { 
      success: true, 
      message: "Successfully fetched the data", 
      data: response.data.choices
    };
  } catch (error: any) {
    if (error.response) {
      LOGGER.info(error.response.status);
      LOGGER.info(error.response.data);
    } else {
      LOGGER.info(error.message);
    }
    return { success: false, message: error.response.data.error.message, data: error.response.data };
  }
};