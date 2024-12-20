import { Injectable } from '@nestjs/common';
//import { client } from '@gradio/client';
//import * as fs from 'fs';
//import * as path from 'path';
export const importDynamic = new Function('modulePath', 'return import(modulePath)');
@Injectable()
export class ExampleService {
    private readonly gradioUrl = 'http://127.0.0.1:7860/';
    constructor() {
        this.predict('Hola como estas soy Alex!', 'es', 'http://localhost:3000/completo.mp3', true)
    }
    async predict(textPrompt: string, language: string, audioUrl: string, agree: boolean): Promise<any> {
        try {
            const { client } = await importDynamic('@gradio/client');
            const supportedLanguages = [
                'en', 'es', 'fr', 'de', 'it', 'pt', 'pl', 'tr',
                'ru', 'nl', 'cs', 'ar', 'zh-cn', 'hu', 'ko', 'ja', 'hi'
            ];
            if (!supportedLanguages.includes(language)) {
                throw new Error(`Language '${language}' is not supported. Supported languages are: ${supportedLanguages.join(', ')}`);
            }

            // Descargar el archivo de audio
            const response = await fetch(audioUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch audio file: ${response.statusText}`);
            }

            // Convertir el archivo de audio en un Buffer
            const audioBuffer = await response.arrayBuffer();
            const audioBase64 = Buffer.from(audioBuffer).toString('base64');

            // Crear un objeto que simula la estructura requerida por Gradio
            const audioFile = {
                name: 'audio_sample.wav', // Nombre del archivo
                data: `data:audio/wav;base64,${audioBase64}`, // Datos del archivo codificados en Base64
            };

            // Crear cliente Gradio
            const app = await client(this.gradioUrl);

            // Realizar la predicción
            const result = await app.predict('/predict', [
                textPrompt,  // Texto ingresado
                language,    // Idioma validado
                audioFile,   // Archivo de audio codificado en Base64
                agree,       // Confirmación boolean
            ]);

            // Devolver el resultado
            console.log(JSON.stringify(result.data[1]))
            return result.data[1];
        } catch (err) {
            console.error(err)
        }

    }

}
