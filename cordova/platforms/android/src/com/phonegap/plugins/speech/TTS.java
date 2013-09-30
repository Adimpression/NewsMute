package com.phonegap.plugins.speech;

import android.speech.tts.TextToSpeech;
import android.speech.tts.TextToSpeech.OnInitListener;
import android.speech.tts.TextToSpeech.OnUtteranceCompletedListener;
import android.util.Log;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Locale;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 11/8/13
 * Time: 8:44 PM
 */
/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2011, IBM Corporation
 *
 * Modified by Murray Macdonald (murray@workgroup.ca) on 2012/05/30 to add support for stop(), pitch(), speed() and interrupt();
 *
 */

public class TTS extends CordovaPlugin implements OnInitListener, OnUtteranceCompletedListener {

    private static final String LOG_TAG = "TTSNM";

    private static final int STOPPED = 0;

    private static final int INITIALIZING = 1;

    private static final int STARTED = 2;

    private static final int SPEAKING = 3;

    private TextToSpeech mTts = null;

    private int state = STOPPED;

    private CallbackContext startupCallbackContext;

    private CallbackContext currentSpeakingCallbackContext;


    public TTS() {
        Log.d(LOG_TAG, "init");
    }

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) {
        Log.d(LOG_TAG, "execute");
        final PluginResult.Status status = PluginResult.Status.OK;

            if (action.equals("speak")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            String text = args.getString(0);
                            text = text.replaceAll("  ", "");//Added by Ravindranth Akila...
                            Log.d(LOG_TAG, "text being red:" + text);

                            if (isReady()) {
                                final HashMap<String, String> map = new HashMap<String, String>();
                                map.put(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, callbackContext.getCallbackId());
                                //@TODO: Loop instead. we could get 14,000 and 4000 is the limit afaik
                                if(text.length() > 3000){
                                    mTts.speak(text.substring(0, 3000), TextToSpeech.QUEUE_FLUSH, null);
                                    //I remember as a child reading out loud "Father" as "Fat her". My mom used to laugh. She still can!
                                    mTts.speak(text.substring(3001, text.length() - 1), TextToSpeech.QUEUE_ADD, map);
                                } else {
                                    mTts.speak(text, TextToSpeech.QUEUE_FLUSH, map);
                                }
                                state = TTS.SPEAKING;
                                PluginResult pr = new PluginResult(PluginResult.Status.NO_RESULT);
                                pr.setKeepCallback(true);
                                callbackContext.sendPluginResult(pr);
                                TTS.this.currentSpeakingCallbackContext = callbackContext;
                            } else {
                                JSONObject error = new JSONObject();
                                error.put("message", "TTS service is still initialzing.");
                                error.put("code", TTS.STOPPED);
                                state = TTS.STOPPED;
                                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, error));
                            }
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                    }
                });
            } else if (action.equals("interrupt")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            final String text = args.getString(0);
                            if (isReady()) {
                                final HashMap<String, String> map = new HashMap<String, String>();
                                //map.put(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, callbackId);
                                mTts.speak(text, TextToSpeech.QUEUE_FLUSH, map);
                                //We wont' set state here. It will be set at onUtteranceCompleted
                                PluginResult pr = new PluginResult(PluginResult.Status.NO_RESULT);
                                pr.setKeepCallback(true);
                                callbackContext.sendPluginResult(pr);
                            } else {
                                JSONObject error = new JSONObject();
                                error.put("message", "TTS service is still initialzing.");
                                error.put("code", TTS.STOPPED);
                                state = TTS.STOPPED;
                                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, error));
                            }
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                    }
                });
            } else if (action.equals("stop")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            if (isReady()) {
                                mTts.stop();
                                //We wont' set state here. It will be set at onUtteranceCompleted
                                callbackContext.sendPluginResult(new PluginResult(status, ""));
                            } else {
                                JSONObject error = new JSONObject();
                                error.put("message", "TTS service is still initialzing.");
                                error.put("code", TTS.STOPPED);
                                state = TTS.STOPPED;
                                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, error));
                            }
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                    }
                });

            } else if (action.equals("silence")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            if (isReady()) {
                                final HashMap<String, String> map = new HashMap<String, String>();
                                map.put(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, callbackContext.getCallbackId());
                                mTts.playSilence(args.getLong(0), TextToSpeech.QUEUE_ADD, map);
                                state = TTS.SPEAKING;
                                PluginResult pr = new PluginResult(PluginResult.Status.NO_RESULT);
                                pr.setKeepCallback(true);
                                callbackContext.sendPluginResult(pr);
                            } else {
                                JSONObject error = new JSONObject();
                                error.put("message", "TTS service is still initialzing.");
                                error.put("code", TTS.STOPPED);
                                state = TTS.STOPPED;
                                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, error));
                            }
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                    }
                });

            } else if (action.equals("speed")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            if (isReady()) {
                                float speed = (float) (args.optLong(0, 100)) / (float) 100.0;
                                mTts.setSpeechRate(speed);
                                callbackContext.sendPluginResult(new PluginResult(status, ""));
                            } else {
                                JSONObject error = new JSONObject();
                                error.put("message", "TTS service is still initialzing.");
                                error.put("code", TTS.STOPPED);
                                state = TTS.STOPPED;
                                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, error));
                            }
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                    }
                });

            } else if (action.equals("pitch")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            if (isReady()) {
                                float pitch = (float) (args.optLong(0, 100)) / (float) 100.0;
                                mTts.setPitch(pitch);
                                callbackContext.sendPluginResult(new PluginResult(status, ""));
                            } else {
                                JSONObject error = new JSONObject();
                                error.put("message", "TTS service is still initialzing.");
                                error.put("code", TTS.STOPPED);
                                state = TTS.STOPPED;
                                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, error));
                            }
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                    }
                });
            } else if (action.equals("startup")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        TTS.this.startupCallbackContext = callbackContext;
                        if (mTts == null) {
                            state = TTS.INITIALIZING;
                            mTts = new TextToSpeech(cordova.getActivity().getApplicationContext(), TTS.this);
                        }
                        PluginResult pluginResult = new PluginResult(status, TTS.INITIALIZING);
                        pluginResult.setKeepCallback(true);
                        startupCallbackContext.sendPluginResult(pluginResult);
                    }
                });
            } else if (action.equals("shutdown")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        if (mTts != null) {
                            mTts.shutdown();
                            state = TTS.STOPPED;
                        }
                        callbackContext.sendPluginResult(new PluginResult(status, ""));
                    }
                });
            } else if (action.equals("getLanguage")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        if (mTts != null) {
                            callbackContext.sendPluginResult(new PluginResult(status, mTts.getLanguage().toString()));
                        }
                    }
                });
            } else if (action.equals("isLanguageAvailable")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        if (mTts != null) {
                            try {
                                final Locale loc = new Locale(args.getString(0));
                                int available = mTts.isLanguageAvailable(loc);
                                callbackContext.sendPluginResult(new PluginResult(status, (available < 0) ? "false" : "true"));
                            } catch (JSONException e) {
                                throw new RuntimeException(e);
                            }
                        }
                    }
                });
            } else if (action.equals("setLanguage")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        if (mTts != null) {
                            try {
                                final Locale loc = new Locale(args.getString(0));
                                int available = mTts.setLanguage(loc);
                                callbackContext.sendPluginResult(new PluginResult(status, (available < 0) ? "false" : "true"));
                            } catch (JSONException e) {
                                throw new RuntimeException(e);
                            }
                        }
                    }
                });
            } else if (action.equals("getState")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        if (mTts != null) {
                            callbackContext.sendPluginResult(new PluginResult(status, String.valueOf(state)));
                        }
                    }
                });
            }
            return true;
        }

    /**
     * Clean up the TTS resources
     */
    public void onDestroy() {
        if (mTts != null) {
            mTts.shutdown();
            state = TTS.STOPPED;
        }
    }

    /**
     * @return If the TTS service ready to play yet or not
     */
    private boolean isReady() {
        Log.d(LOG_TAG, "isReady");
        return (state == TTS.STARTED || state == TTS.SPEAKING);
    }

    /**
     * Called when the TTS service is initialized.
     *
     * @param status
     */
    public void onInit(int status) {
        Log.d(LOG_TAG, "onInit");

        if (status == TextToSpeech.SUCCESS) {
            state = TTS.STARTED;
            //mTts.speak("Plugin initialized", TextToSpeech.QUEUE_FLUSH, null);

            PluginResult result = new PluginResult(PluginResult.Status.OK, TTS.STARTED);
            result.setKeepCallback(false);
            //this.success(result, this.startupCallbackId);
            this.startupCallbackContext.sendPluginResult(result);
            mTts.setOnUtteranceCompletedListener(this);
        } else if (status == TextToSpeech.ERROR) {
            state = TTS.STOPPED;
            PluginResult result = new PluginResult(PluginResult.Status.ERROR, TTS.STOPPED);
            result.setKeepCallback(false);
            this.startupCallbackContext.sendPluginResult(result);
        }
    }

    /**
     * Once the utterance has completely been played call the speak's success callback
     */
    public void onUtteranceCompleted(String utteranceId) {
        state = TTS.STARTED;
        PluginResult result = new PluginResult(PluginResult.Status.OK);
        result.setKeepCallback(false);
        this.currentSpeakingCallbackContext.sendPluginResult(result);
    }
}
