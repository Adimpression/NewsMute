/*
      Licensed to the Apache Software Foundation (ASF) under one
      or more contributor license agreements.  See the NOTICE file
      distributed with this work for additional information
      regarding copyright ownership.  The ASF licenses this file
      to you under the Apache License, Version 2.0 (the
      "License"); you may not use this file except in compliance
      with the License.  You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

      Unless required by applicable law or agreed to in writing,
      software distributed under the License is distributed on an
      "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
      KIND, either express or implied.  See the License for the
      specific language governing permissions and limitations
      under the License.
*/

package ai.newsmute;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;

public class Main extends DroidGap {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().requestFeature(Window.FEATURE_PROGRESS);

        super.init();

        final WebViewClient client = new WebViewClient() {

            public boolean shouldOverrideUrlLoading(final WebView view, final String url) {
//                view.loadUrl(url);
                return false;
            }

            @Override
            public void onPageStarted(final WebView view, final String url, final Bitmap favicon) {
//                Toast.makeText(Main.this, "Page loading", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onPageFinished(final WebView view, final String url) {
//                Toast.makeText(Main.this, "Page loaded", Toast.LENGTH_SHORT).show();
            }
        };
//        appView.setWebViewClient(client);


        super.appView.clearCache(true);

        //super.appView.setBackgroundColor(Color.TRANSPARENT);
        //super.appView.setBackgroundColor(0x00000000);
        //super.appView.setLayerType(WebView.LAYER_TYPE_SOFTWARE, null);


        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html")

        //appView.getUrl returns wrong and a lot of other issues
        super.appView.setOnKeyListener(new View.OnKeyListener() {
            public boolean isAtHome = false;

            @Override
            public boolean onKey(final View v, final int keyCode, final KeyEvent event) {
// Check if the key event was the Back button and if there's history
                if (keyCode == KeyEvent.KEYCODE_BACK) {
                    new AlertDialog.Builder(Main.this)
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setTitle("Exit or go to home?")
                            .setMessage("(Press back button to hide this alert)")
                            .setPositiveButton("Exit", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    finish();
                                }

                            })
                            .setNegativeButton("Home", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    appView.loadUrl(Config.getStartUrl());
                                }
                            })
                            .show();
                    return true;
                } else {
                    return false;
                }
            }
        });
    }
}



/*

package ai.newsmute;

        import android.app.Activity;
        import android.content.Intent;
        import android.graphics.Bitmap;
        import android.os.Bundle;
        import android.util.Log;
        import android.view.KeyEvent;
        import android.view.View;
        import android.webkit.WebView;
        import android.webkit.WebViewClient;
        import android.widget.Toast;
        import org.apache.cordova.*;

        import java.util.concurrent.ExecutorService;

public class Main extends Activity implements CordovaInterface {
    private CordovaWebView webView;

    private CordovaPlugin activityResultCallback;

    private boolean keepRunning;

    private boolean activityResultKeepRunning;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.main);

        webView = (CordovaWebView) findViewById(R.id.webView);

        Config.init(this);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(final WebView view, final String url) {
                return super.shouldOverrideUrlLoading(view, url);
            }

            @Override
            public void onPageStarted(final WebView view, final String url, final Bitmap favicon) {
                Toast.makeText(Main.this, "Page loading", Toast.LENGTH_SHORT).show();
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(final WebView view, final String url) {
                Toast.makeText(Main.this, "Page loaded", Toast.LENGTH_SHORT).show();
                super.onPageFinished(view, url);
            }
        });

        webView.clearCache(true);

        webView.loadUrl(Config.getStartUrl());



        webView.loadUrl(Config.getStartUrl());

        webView.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(final View v, final int keyCode, final KeyEvent event) {
                if (keyCode == KeyEvent.KEYCODE_BACK) {
                    final String url = webView.getUrl();
                    final String startUrl = Config.getStartUrl();
                    Log.wtf(Main.class.getSimpleName(), url);
                    Log.wtf(Main.class.getSimpleName(), startUrl);
                    if (url.equals(startUrl)) {
                        Main.super.finish();
                        return true;
                    } else {
                        webView.loadUrl(startUrl);
                        return true;
                    }
                } else {
                    return false;
                }
            }
        });

    }

    @Override
    public void startActivityForResult(final CordovaPlugin command, final Intent intent, final int requestCode) {
        this.activityResultCallback = command;
        this.activityResultKeepRunning = this.keepRunning;

        if (command != null) {
            this.keepRunning = false;
        }

        super.startActivityForResult(intent, requestCode);

    }

    @Override
    public void setActivityResultCallback(final CordovaPlugin cordovaPlugin) {
        this.activityResultCallback = cordovaPlugin;

    }

    @Override
    public Activity getActivity() {
        return this;
    }

    @Override
    public Object onMessage(final String id, final Object data) {

        LOG.d(Main.class.getClass().getSimpleName(), "onMessage(" + id + "," + data + ")");
        if ("exit".equals(id)) {
            super.finish();
        }
        return null;
    }

    @Override
    public ExecutorService getThreadPool() {
        return null;
    }
}


*/
