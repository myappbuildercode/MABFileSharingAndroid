package org.apache.cordova.plugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.LOG;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;

public class Video_Compress extends CordovaPlugin{

	String Tag="Video_Compress";
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		if(args!=null && args.length()>0){
			String[] temp=args.getString(0).split("/");
			temp=getVideoPath(temp[temp.length-1]);
			if(temp[0].equalsIgnoreCase("success")){
				PluginResult progressResult = new PluginResult(	PluginResult.Status.OK, temp[1]);
				progressResult.setKeepCallback(true);
				callbackContext.sendPluginResult(progressResult);
			}else{
				PluginResult progressResult = new PluginResult(	PluginResult.Status.ERROR, temp[0]);
				progressResult.setKeepCallback(true);
				callbackContext.sendPluginResult(progressResult);
			}
		}else{
			PluginResult progressResult = new PluginResult(	PluginResult.Status.ERROR, "parameter required or incorrect");
			progressResult.setKeepCallback(true);
			callbackContext.sendPluginResult(progressResult);
		}

		return super.execute(action, args, callbackContext);
	}



	private String[] getVideoPath(String name) {
		// TODO Auto-generated method stub
		Log.e(Tag, "file name:"+name);
		Uri mUri=MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
		String[] cloumns={MediaStore.Video.VideoColumns.DATA,
						  MediaStore.Video.VideoColumns._ID,
						  MediaStore.Video.VideoColumns.TITLE};
		String selection=MediaStore.Video.Media.DATA+" Like '%"+name+"'";
		Cursor videocursor = Video_Compress.this.cordova.getActivity().managedQuery(mUri, cloumns, selection, null, null);
		if(videocursor.getCount()>0){
			videocursor.moveToFirst();
			while(!videocursor.isAfterLast()){
				String path=videocursor.getString(0);
				Log.e(Tag, "path:"+path);
				String[] temp=path.split("/");
				if(temp[temp.length-1].equalsIgnoreCase(name)){
					return new String[]{"success",path};
				}
				videocursor.moveToNext();
			}
			
		}else{
			return new String[]{"error","Video not Founded..."};
		}
		return new String[]{"error","Video not Founded..."};
	}
	
	
	public void onDestroy() {
		super.onDestroy();
	}
	
}
