import android.accounts.Account;
import android.accounts.AccountManager;
import android.util.Patterns;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.AbstractCollection;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class ValidEmail extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        final Pattern emailPattern = Patterns.EMAIL_ADDRESS; // API level 8+
        final Account[] accounts = AccountManager.get(cordova.getActivity().getApplicationContext()).getAccounts();
        final List<String> emails = new ArrayList<String>();
        for (final Account account : accounts) {
            if (emailPattern.matcher(account.name).matches()) {
                emails.add(account.name);
            }
        }

        callbackContext.success(new JSONArray(emails));

        return true;
    }
}
