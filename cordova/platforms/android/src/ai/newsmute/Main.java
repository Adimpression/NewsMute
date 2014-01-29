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

import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.widget.Toast;
import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;

public class Main extends DroidGap {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().requestFeature(Window.FEATURE_PROGRESS);

        super.init();

        super.appView.clearCache(true);

        //super.appView.setBackgroundColor(Color.TRANSPARENT);
        //super.appView.setBackgroundColor(0x00000000);
        //super.appView.setLayerType(WebView.LAYER_TYPE_SOFTWARE, null);


        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html")

        super.appView.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(final View v, final int keyCode, final KeyEvent event) {
// Check if the key event was the Back button and if there's history
                if (keyCode == KeyEvent.KEYCODE_BACK && appView.canGoBack()) {
                    //appView.goBack();
                    Main.super.loadUrl(Config.getStartUrl());
                    return true;
                } else {
                    // If it wasn't the Back key or there's no web page history, bubble up to the default
                    // system behavior (probably exit the activity)
                    Main.super.finish();
                    return onKeyDown(keyCode, event);
                }
            }
        });

    }
}

