package ai.newsmute;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.util.Patterns;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.*;
import java.util.regex.Pattern;

public class ValidEmail extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        final Pattern emailPattern = Patterns.EMAIL_ADDRESS; // API level 8+
        final Account[] accounts = AccountManager.get(cordova.getActivity().getApplicationContext()).getAccounts();
        final Set<String> emails = new HashSet<String>();//Set, because we get duplicate emails
        for (final Account account : accounts) {
            if (emailPattern.matcher(account.name).matches()) {
                emails.add(account.name);
            }
        }

        final JSONObject message = new JSONObject();
        message.put("emails", new JSONArray(emails));
        callbackContext.success(message);

        return true;
    }
}
