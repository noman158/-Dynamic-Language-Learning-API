import { SpeechClient } from '@google-cloud/speech';
import { ApiError } from '../utils/apiError.js';

const speechClient = new SpeechClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_PROJECT_ID
});

export const handleSpeechToText = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No audio file provided');
    }

    const audio = {
      content: req.file.buffer.toString('base64'),
    };

    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: req.body.languageCode || 'en-US',
    };

    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    res.json({
      success: true,
      transcription,
      confidence: response.results[0]?.alternatives[0]?.confidence || 0
    });
  } catch (error) {
    next(error);
  }
};