import { Injectable } from '@nestjs/common';
//import { client } from "@gradio/client";
export const importDynamic = new Function('modulePath', 'return import(modulePath)');
@Injectable()
export class AppService {
  constructor(){
   // this.obtenerVOx();
  }
  getHello(): string {
    return 'Hello World!';
  }
  async obtenerVOx(){
    
   // const response_0 = await fetch("https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav");
  //const exampleAudio = await response_0.blob();
  try {
    const { client } = await importDynamic('@gradio/client');       
    const response_1 = await fetch("https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav");
    
    
    
    const exampleAudio = await response_1.blob();
    //const baseConvertido = await this.blobToBase64(exampleAudio);
    //console.log(baseConvertido)
    const app = await client("http://127.0.0.1:7860/");
    const result = await app.predict("/predict", [		
      "Howdy!", // string  in 'Text Prompt' Textbox component		
      "en,en", // string (Option from: [('en', 'en'), ('es', 'es'), ('fr', 'fr'), ('de', 'de'), ('it', 'it'), ('pt', 'pt'), ('pl', 'pl'), ('tr', 'tr'), ('ru', 'ru'), ('nl', 'nl'), ('cz', 'cz'), ('ar', 'ar'), ('zh-cn', 'zh-cn')]) in 'Language' Dropdown component
      exampleAudio, 	// blob in 'Reference Audio' Audio component		
      true, // boolean  in 'Agree' Checkbox component
]);

    console.log(result.data);
  } catch (error) {
    console.error(error)
  }
  
  }
  async blobToBase64(blob: Blob): Promise<string> {
    const stream = blob.stream();
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk)); // Convertir y acumular chunks
    }

    const buffer = Buffer.concat(chunks); // Combinar todos los chunks en un único Buffer
    return buffer.toString('base64'); // Convertir a Base64 y devolver
  }



}
