package org.apache.cordova.plugin;

import android.annotation.SuppressLint;
import android.content.Context;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.Bitmap.Config;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;

import com.myappbuilder.mabfiles.R;
import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.plugin.ScalingUtilities.ScalingLogic;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
//import android.widget.Toast;

public class ImageCompress extends CordovaPlugin {

	public static boolean boo_result = false;
	public CallbackContext callbackContext1;
	public Context context;
	private String file_getter = null, file_setter = null,
			file_filename = null;
	private File f = null;
	private Bitmap scaledBitmap = null;
	private String strMyImagePath = null;
	public static int SCALE = 25;
	private int rswidth = 0, rsheight = 0;
	private String stng_img = null, stng_method = null, stng_api = null;
	private String[] stng_ary = null;

	private JSONObject obj;
	private String TAG = "TAG";

	private int srcBgId = R.drawable.bg;
	static int w = 300;
	static int h = 280;

	// ["320","460","splash_image","C:\\fakepath\\20140905_154637.jpg","http:\/\/build.myappbuilder.com\/api\/apps\/settings\/general.json?","put",
	// {"bar_button_color":"light","title":"apptest","description":"<p
	// style=\"text-align:
	// center;\">Dgui<\/p>","api_key":"f538901f8804a3ad9d322d1cade66495","domain":"buildap.ps","subdomain":"fgg","button_color":"energized","bar_color":"balanced"}]
	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		if (action.equals("imageCompress")) {
			Log.e("jsonarray", args.toString());
			callbackContext1 = callbackContext;
			context = cordova.getActivity().getApplicationContext();
			rswidth = Integer.parseInt(args.getString(0));
			rsheight = Integer.parseInt(args.getString(1));
			stng_img = args.getString(2);
			file_filename = args.getString(3);
			stng_api = args.getString(4);
			stng_method = args.getString(5);
			obj = args.getJSONObject(6);

			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
				Log.d("new", file_filename);
				file_getter = getKitKat(Uri.parse(file_filename));
				Log.d("new", file_getter);
				if (file_getter != null) {
					ExifInterface exif = null;
					try {
						exif = new ExifInterface(file_getter);
					} catch (IOException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}

					int orientation = exif.getAttributeInt(
							ExifInterface.TAG_ORIENTATION,
							ExifInterface.ORIENTATION_NORMAL);
					Matrix matrix = new Matrix();
					if (orientation == 6) {
						matrix.postRotate(90);
					} else if (orientation == 3) {
						matrix.postRotate(180);
					} else if (orientation == 8) {
						matrix.postRotate(270);
					}

					if (file_getter != null) {
						Bitmap unbgbtmp = ScalingUtilities.decodeResource(
								context.getResources(), srcBgId, w, h,
								ScalingLogic.FIT);
						Bitmap bgbtmp = ScalingUtilities.createScaledBitmap(
								unbgbtmp, w, h, ScalingLogic.FIT);
						unbgbtmp.recycle();
						Bitmap unrlbtmp = ScalingUtilities.decodeFile(
								file_getter, w, h, ScalingLogic.FIT);
						Bitmap rlbtmp = ScalingUtilities.createScaledBitmap(
								unrlbtmp, w, h, ScalingLogic.FIT);
						unrlbtmp.recycle();
						Bitmap newscaledBitmap = ProcessingBitmapTwo(bgbtmp,
								rlbtmp);
						createBitmap(newscaledBitmap);
					} else {
						PluginResult progressResult = new PluginResult(
								PluginResult.Status.ERROR, "Try Again Later");
						progressResult.setKeepCallback(true);
						callbackContext1.sendPluginResult(progressResult);
					}

				} else {
					PluginResult progressResult = new PluginResult(
							PluginResult.Status.ERROR, "Try Again Later");
					progressResult.setKeepCallback(true);
					callbackContext1.sendPluginResult(progressResult);
				}

			} else {
				Log.d("new", file_filename);
				file_getter = getFileNameByUri(context,
						Uri.parse(file_filename));
				Log.d("new", file_getter);
				if (file_getter != null) {
					decodeFile(file_getter, rswidth, rsheight);
				} else {
					PluginResult progressResult = new PluginResult(
							PluginResult.Status.ERROR, "Try Again Later");
					progressResult.setKeepCallback(true);
					callbackContext1.sendPluginResult(progressResult);
				}

			}
			return true;
		} else {
			PluginResult progressResult = new PluginResult(
					PluginResult.Status.ERROR, "Try Again Later");
			progressResult.setKeepCallback(true);
			callbackContext1.sendPluginResult(progressResult);
		}
		return false;
	}

	private Bitmap ProcessingBitmapTwo(Bitmap bm1, Bitmap bm2){
		Bitmap newBitmap = null;
	       
        int w;
        if(bm1.getWidth() >= bm2.getWidth()){
            w = bm1.getWidth();
        }else{
            w = bm2.getWidth();
        }
       
        int h;
        if(bm1.getHeight() >= bm2.getHeight()){
            h = bm1.getHeight();
        }else{
            h = bm2.getHeight();
        }
       
        Config config = bm1.getConfig();
        if(config == null){
            config = Config.ARGB_4444;
        }
       
        newBitmap = Bitmap.createBitmap(w, h, config);
        Canvas newCanvas = new Canvas(newBitmap);
        newCanvas.drawColor(Color.WHITE);
        if(bm2.getWidth() == bm2.getHeight()){
            newCanvas.drawBitmap(bm2, (w - bm2.getWidth())/2, (h - bm2.getHeight())/2, null);
        }else{
            newCanvas.drawBitmap(bm2, (w/2)-(bm2.getWidth()/2), (h/2)-(bm2.getHeight()/2), null);
        }
       
        return newBitmap;
	}

	private void createBitmap(Bitmap newscaledBitmap) {
		FileOutputStream fos = null;
		String extr = Environment.getExternalStorageDirectory().toString();
		File mFolder = new File(extr + "/MYAPPBUILDER");
		if (!mFolder.exists()) {
			mFolder.mkdir();
		}

		String s = "myappbuilder.png";

		f = new File(mFolder.getAbsolutePath(), s);

		strMyImagePath = f.getAbsolutePath();
		try {
			fos = new FileOutputStream(f);
			newscaledBitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
			fos.flush();
			fos.close();
		} catch (FileNotFoundException e) {

			e.printStackTrace();
		} catch (Exception e) {

			e.printStackTrace();
		}
		if (strMyImagePath == null) {
			PluginResult progressResult = new PluginResult(
					PluginResult.Status.OK, "Try Again Later");
			progressResult.setKeepCallback(true);
			callbackContext1.sendPluginResult(progressResult);
		} else {
			Bitmap btmp = BitmapFactory.decodeFile(strMyImagePath);
			Log.d("final width",
					String.valueOf(btmp.getHeight() + " , final Height ="
							+ btmp.getWidth()));
			try {
				imagePost(f);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

	}

	@SuppressLint("NewApi")
	public String getKitKat(Uri uri) {
		String fileName = "unknown";// default fileName
		Uri filePathUri = uri;
		fileName = filePathUri.getPath();
		/*if (uri.getScheme().toString().compareTo("content") == 0) {
			Cursor cursor = context.getContentResolver().query(uri, null, null,
					null, null);
			cursor.moveToFirst();
			String document_id = cursor.getString(0);
			document_id = document_id
					.substring(document_id.lastIndexOf(":") + 1);
			cursor.close();

			cursor = context
					.getContentResolver()
					.query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
							null, MediaStore.Images.Media._ID + " = ? ",
							new String[] { document_id }, null);
			cursor.moveToFirst();
			fileName = cursor.getString(cursor
					.getColumnIndex(MediaStore.Images.Media.DATA));
			cursor.close();
			Log.d("content", "content");
		} else if (uri.getScheme().compareTo("file") == 0) {
			fileName = filePathUri.getPath();
			Log.d("file", "file");
		} else {
			fileName = filePathUri.getPath();
			Log.d("else", "else");
		}*/
		return fileName;
	}

	public Bitmap getResizedBitmap(Bitmap bm, int newHeight, int newWidth) {
		int width = bm.getWidth();
		int height = bm.getHeight();
		float scaleWidth = ((float) newWidth) / width;
		float scaleHeight = ((float) newHeight) / height;
		// CREATE A MATRIX FOR THE MANIPULATION
		Matrix matrix = new Matrix();
		// RESIZE THE BIT MAP
		matrix.postScale(scaleWidth, scaleHeight);

		// "RECREATE" THE NEW BITMAP
		Bitmap resizedBitmap = Bitmap.createBitmap(bm, 0, 0, width, height,
				matrix, false);
		return resizedBitmap;
	}

	private String decodeFile(String path, int DESIREDWIDTH, int DESIREDHEIGHT) {

		FileOutputStream fos = null;
		ExifInterface exif = null;
		try {
			exif = new ExifInterface(path);
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		int orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION,
				ExifInterface.ORIENTATION_NORMAL);
		Matrix matrix = new Matrix();
		if (orientation == 6) {
			matrix.postRotate(90);
		} else if (orientation == 3) {
			matrix.postRotate(180);
		} else if (orientation == 8) {
			matrix.postRotate(270);
		}

		if (file_getter != null) {
			Bitmap unbgbtmp = ScalingUtilities.decodeResource(
					context.getResources(), srcBgId, w, h, ScalingLogic.FIT);
			Bitmap bgbtmp = ScalingUtilities.createScaledBitmap(unbgbtmp, w, h,
					ScalingLogic.FIT);
			unbgbtmp.recycle();
			Bitmap unrlbtmp = ScalingUtilities.decodeFile(file_getter, w, h,
					ScalingLogic.FIT);
			Bitmap rlbtmp = ScalingUtilities.createScaledBitmap(unrlbtmp, w, h,
					ScalingLogic.FIT);
			unrlbtmp.recycle();
			Bitmap newscaledBitmap = ProcessingBitmapTwo(bgbtmp, rlbtmp);
			String extr = Environment.getExternalStorageDirectory().toString();

			File mFolder = new File(extr + "/MYAPPBUILDER");
			if (!mFolder.exists()) {
				mFolder.mkdir();
			}

			String s = "myappbuilder.png";

			f = new File(mFolder.getAbsolutePath(), s);

			strMyImagePath = f.getAbsolutePath();
			try {
				fos = new FileOutputStream(f);
				newscaledBitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
				fos.flush();
				fos.close();
			} catch (FileNotFoundException e) {

				e.printStackTrace();
			} catch (Exception e) {

				e.printStackTrace();
			}

		} else {
			PluginResult progressResult = new PluginResult(
					PluginResult.Status.OK, "Try Again Later");
			progressResult.setKeepCallback(true);
			callbackContext1.sendPluginResult(progressResult);
			return path;
		}

		if (strMyImagePath == null) {
			PluginResult progressResult = new PluginResult(
					PluginResult.Status.OK, "Try Again Later");
			progressResult.setKeepCallback(true);
			callbackContext1.sendPluginResult(progressResult);
			return path;
		} else {
			Bitmap btmp = BitmapFactory.decodeFile(strMyImagePath);
			Log.d("final width",
					String.valueOf(btmp.getHeight() + " , final Height ="
							+ btmp.getWidth()));
			try {
				imagePost(f);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		return strMyImagePath;

	}

	private void imagePost(File f) throws JSONException, FileNotFoundException {

		RequestParams params = new RequestParams();
		if (obj != null) {
			if (obj.has("api_key")) {
				params.put("api_key", obj.getString("api_key"));
			}

			if (obj.has("id")) {
				params.put("id", obj.getString("id"));
			}

			if (obj.has("firstname")) {
				params.put("firstname", obj.getString("firstname"));
			}

			if (obj.has("lastname")) {
				params.put("lastname", obj.getString("lastname"));
			}

			if (obj.has("username")) {
				params.put("username", obj.getString("username"));
			}

			if (obj.has("email")) {
				params.put("email", obj.getString("email"));
			}

			if (obj.has("phone")) {
				params.put("phone", obj.getString("phone"));
			}

			if (obj.has("password")) {
				params.put("password", obj.getString("password"));
			}

			if (obj.has("password_confirm")) {
				params.put("password_confirm",
						obj.getString("password_confirm"));
			}

			if (obj.has("bar_button_color")) {
				params.put("bar_button_color",
						obj.getString("bar_button_color"));
			}
			if (obj.has("button_id")) {
				params.put("button_id", obj.getString("button_id"));
			}
			if (obj.has("id")) {
				params.put("id", obj.getString("id"));
			}
			if (obj.has("title")) {
				params.put("title", obj.getString("title"));
			}

			if (obj.has("text")) {
				params.put("text", obj.getString("text"));
			}
			if (obj.has("description")) {
				params.put("description",
						(obj.getString("description")).toString());
			}
			// Html.fromHtml(obj.getString("description")).toString());
			if (obj.has("api_key")) {
				params.put("api_key", obj.getString("api_key"));
			}
			if (obj.has("subdomain")) {
				params.put("subdomain", obj.getString("subdomain"));
			}
			if (obj.has("domain")) {
				params.put("domain", obj.getString("domain"));
			}
			if (obj.has("bar_color")) {
				params.put("bar_color", obj.getString("bar_color"));
			}
			if (obj.has("button_color")) {
				params.put("button_color", obj.getString("button_color"));
			}
			String Path1 = f.getAbsolutePath();

			params.put(stng_img, f);

		}

		AsyncHttpClient client = new AsyncHttpClient();
		// client.addHeader("Content-type", "multipart/form-data");
		// client.addHeader("Content-type",
		// "application/x-www-form-urlencoded; charset=utf-8");
		client.addHeader("Accept", "appliction/json");
		// client.addHeader("Content-Transfer-Encoding", "binary");

		if (stng_method.contentEquals("POST")) {
			client.post(stng_api, params, new AsyncHttpResponseHandler() {
				@Override
				public void onSuccess(String arg0) {

					super.onSuccess(arg0);
					JSONObject result;
					try {
						result = new JSONObject(arg0);
						Log.d("create success folder", arg0);
						Log.d("from success", "get json");
						PluginResult progressResult = new PluginResult(
								PluginResult.Status.OK, result);
						progressResult.setKeepCallback(true);
						callbackContext1.sendPluginResult(progressResult);
						Log.d("from success", "from success");
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

				}

				@Override
				public void onFinish() {
					super.onFinish();
					Log.d("from finish", "from finish");
				}

				@Override
				public void onFailure(Throwable arg0, String arg1) {

					if (arg1 != null) {
						JSONObject result;
						try {
							result = new JSONObject(arg1);
							Log.d("create success folder", arg1);
							Log.d("from success", "get json");
							PluginResult progressResult = new PluginResult(
									PluginResult.Status.OK, result);
							progressResult.setKeepCallback(true);
							callbackContext1.sendPluginResult(progressResult);
							Log.d("from success", "from success");
						} catch (JSONException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}

					super.onFailure(arg0, arg1);

				}

			});
		} else if (stng_method.contentEquals("PUT")) {
			client.put(stng_api, params, new AsyncHttpResponseHandler() {
				@Override
				public void onSuccess(String arg0) {

					super.onSuccess(arg0);
					JSONObject result;
					try {
						result = new JSONObject(arg0);
						Log.d("create success folder", arg0);
						Log.d("from success", "get json");
						PluginResult progressResult = new PluginResult(
								PluginResult.Status.OK, result);
						progressResult.setKeepCallback(true);
						callbackContext1.sendPluginResult(progressResult);
						Log.d("from success", "from success");
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

				}

				@Override
				public void onFinish() {
					super.onFinish();
					Log.d("from finish", "from finish");
					// Toast.makeText(context, "post finish", Toast.LENGTH_LONG)
					// .show();

				}

				@Override
				public void onFailure(Throwable arg0, String arg1) {

					JSONObject result;
					try {
						result = new JSONObject(arg1);
						Log.d("create success folder", arg1);
						Log.d("from success", "get json");
						PluginResult progressResult = new PluginResult(
								PluginResult.Status.OK, result);
						progressResult.setKeepCallback(true);
						callbackContext1.sendPluginResult(progressResult);
						Log.d("from success", "from success");
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					super.onFailure(arg0, arg1);

				}

			});
		}

	}

	public static String getFileNameByUri(Context context, Uri uri) {
		String fileName = "unknown";// default fileName
		Uri filePathUri = uri;
		if (uri.getScheme().toString().compareTo("content") == 0) {
			Cursor cursor = context.getContentResolver().query(uri, null, null,
					null, null);
			if (cursor.moveToFirst()) {
				int column_index = cursor
						.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
				filePathUri = Uri.parse(cursor.getString(column_index));
				fileName = filePathUri.getPath();
			}
			Log.d("content", "content");
		} else if (uri.getScheme().compareTo("file") == 0) {
			fileName = filePathUri.getPath();
			Log.d("file", "file");
		} else {
			fileName = filePathUri.getPath();
			Log.d("else", "else");
		}
		return fileName;
	}

}

// function(e){alert(e);},"Echo", "echo", ["640", "480",
// document.getElementById("videoUpload").value])

