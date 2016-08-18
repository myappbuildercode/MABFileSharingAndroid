package org.apache.cordova.plugin;

import android.annotation.SuppressLint;
import android.content.Context;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.content.CursorLoader;
import android.util.Log;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.plugin.ScalingUtilities.ScalingLogic;
import org.apache.http.conn.ConnectTimeoutException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;

public class Echo_Small extends CordovaPlugin {

	public static boolean boo_result = false;
	public CallbackContext callbackContext1;
	public Context context;
	private ArrayList<CustomGallery> data = new ArrayList<CustomGallery>();
	private String file_getter = null, file_setter = null,
			file_filename = null;
	private File f = null;
	private Bitmap scaledBitmap = null;
	private String strMyImagePath = null;
	public static int SCALE = 25;
	private int rswidth = 0, rsheight = 0;
	private String stng_img = null, stng_method = null, stng_api = null;
	private String[] stng_ary = null;
	private String TAG = "TAG";
	private JSONObject obj;

	// ["320","460","splash_image","C:\\fakepath\\20140905_154637.jpg","http:\/\/build.myappbuilder.com\/api\/apps\/settings\/general.json?","put",
	// {"bar_button_color":"light","title":"apptest","description":"<p
	// style=\"text-align:
	// center;\">Dgui<\/p>","api_key":"f538901f8804a3ad9d322d1cade66495","domain":"buildap.ps","subdomain":"fgg","button_color":"energized","bar_color":"balanced"}]
	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		if (action.equals("echo_small")) {
			Log.e("jsonarray", args.toString());
			callbackContext1 = callbackContext;
			context = cordova.getActivity();
			rswidth = Integer.parseInt(args.getString(0));
			rsheight = Integer.parseInt(args.getString(1));
			stng_img = args.getString(2);
			file_filename = args.getString(3);
			stng_api = args.getString(4);
			stng_method = args.getString(5);
			obj = args.getJSONObject(6);

			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
				String[] getter_ary = file_filename.split("fakepath");
				if (getter_ary.length == 2) {
					String getter = getter_ary[1].substring(1);
					Log.d("filename", getter);
					Uri contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
					Log.d("filename", contentUri.toString());
					Uri myUri = Uri.parse(contentUri.toString() + "/" + getter);
					file_getter = getKitKat(myUri);
					if (file_getter != null) {
					ExifInterface exif = null;
					try {
						exif = new ExifInterface(file_getter);
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

					Bitmap rotatedBitmap = null;
					int DESIREDWIDTH = rswidth, DESIREDHEIGHT = rsheight;

					Bitmap scaledBitmap = BitmapFactory.decodeFile(file_getter);
					if (scaledBitmap != null) {
						rotatedBitmap = Bitmap.createBitmap(scaledBitmap, 0, 0,
								scaledBitmap.getWidth(), scaledBitmap.getHeight(), matrix,
								true);

						Bitmap unscaledBitmap = ScalingUtilities.decodeFile(rotatedBitmap,
								DESIREDWIDTH, DESIREDHEIGHT, ScalingLogic.FIT);
						Bitmap scaled = ScalingUtilities.createScaledBitmap(unscaledBitmap,
								DESIREDWIDTH, DESIREDHEIGHT, ScalingLogic.FIT);
						Bitmap newscaledBitmap = getResizedBitmap(scaled, DESIREDHEIGHT,
								DESIREDWIDTH);
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
				}
			} else {
				String[] getter_ary = file_filename.split("fakepath");
				Log.d("filename", file_filename);
				if (getter_ary.length == 2) {
					file_getter = getter_ary[1].substring(1);
					if (file_getter != null) {
						file_setter = getImagePath(file_getter);
						if(file_setter != null){
							decodeFile(file_setter, rswidth, rsheight);
						}else{
							getGalleryPhotos();
							boolean boo = false;
							for (int dr = 0; dr < data.size(); dr++) {
								String split = data.get(dr).sdcardPath;
								if (split.contains(file_getter)) {
									file_setter = split;
									decodeFile(file_setter, rswidth, rsheight);
									Log.d("get", file_setter);
									boo = true;
									break;
								}
							}
							if(!boo){
								PluginResult progressResult = new PluginResult(
										PluginResult.Status.ERROR, "Try Again Later");
								progressResult.setKeepCallback(true);
								callbackContext1.sendPluginResult(progressResult);
							}
						}
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
		Cursor cursor = context.getContentResolver().query(uri, null, null,
				null, null);
		cursor.moveToFirst();
		String document_id = cursor.getString(0);
		document_id = document_id.substring(document_id.lastIndexOf(":") + 1);
		cursor.close();

		cursor = context.getContentResolver().query(
				android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
				null, MediaStore.Images.Media._ID + " = ? ",
				new String[] { document_id }, null);
		cursor.moveToFirst();
		String path = cursor.getString(cursor
				.getColumnIndex(MediaStore.Images.Media.DATA));
		cursor.close();

		return path;

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

		Bitmap rotatedBitmap = null;

		Bitmap scaledBitmap = BitmapFactory.decodeFile(path);
		if (scaledBitmap != null) {
			rotatedBitmap = Bitmap.createBitmap(scaledBitmap, 0, 0,
					scaledBitmap.getWidth(), scaledBitmap.getHeight(), matrix,
					true);

			Bitmap unscaledBitmap = ScalingUtilities.decodeFile(rotatedBitmap,
					DESIREDWIDTH, DESIREDHEIGHT, ScalingLogic.FIT);
			Bitmap scaled = ScalingUtilities.createScaledBitmap(unscaledBitmap,
					DESIREDWIDTH, DESIREDHEIGHT, ScalingLogic.FIT);
			Bitmap newscaledBitmap = getResizedBitmap(scaled, DESIREDHEIGHT,
					DESIREDWIDTH);

			//Log.d("height",
					//String.valueOf("height " + DESIREDHEIGHT + " = "
							//+ newscaledBitmap.getHeight()));
			//Log.d("width",
					//String.valueOf("width " + DESIREDWIDTH + " = "
							//+ newscaledBitmap.getWidth()));
			// Toast.makeText(
			// context,
			// String.valueOf("height " + DESIREDHEIGHT + " = "
			// + newscaledBitmap.getHeight() + "width "
			// + DESIREDWIDTH + " = "
			// + newscaledBitmap.getWidth()),
			// Toast.LENGTH_LONG).show();
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
			if (obj.has("bar_button_color")) {
				params.put("bar_button_color",
						obj.getString("bar_button_color"));
			}
			if(obj.has("id")){
				params.put("id", obj.getString("id"));
			}
			Log.d("id", obj.getString("id"));
		//	Toast.makeText(context, obj.getString("id").toString(),
				//	Toast.LENGTH_LONG).show();
			
			if (obj.has("title")) {
				params.put("title", obj.getString("title"));
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
		client.addHeader("Content-type", "multipart/form-data");
		client.addHeader("Content-type",
				"application/x-www-form-urlencoded; charset=utf-8");
		client.addHeader("Accept", "appliction/json");
		client.addHeader("Content-Transfer-Encoding", "binary");

		if (stng_method.contentEquals("post")) {
			client.post(stng_api, params, new AsyncHttpResponseHandler() {
				@Override
				public void onSuccess(String arg0) {
					super.onSuccess(arg0);
					Log.d("create success folder", arg0);
					Log.d("from success", "get json");
					PluginResult progressResult = new PluginResult(
							PluginResult.Status.OK, arg0);
					progressResult.setKeepCallback(true);
					callbackContext1.sendPluginResult(progressResult);
					Log.d("from success", "from success");

				}

				@Override
				public void onFinish() {
					super.onFinish();
					Log.d("from finish", "from finish");
				}

				@Override
				public void onFailure(Throwable arg0, String arg1) {

					if (arg0.getCause() instanceof ConnectTimeoutException) {
					//	Toast.makeText(context, "Connection timeout !",
					//			Toast.LENGTH_LONG).show();
					}
					Log.d("argo", arg1);
					Log.d("onFailure", "onFailure");
					super.onFailure(arg0, arg1);
				}

			});
		} else if (stng_method.contentEquals("put")) {
			client.put(stng_api, params, new AsyncHttpResponseHandler() {
				@Override
				public void onSuccess(String arg0) {
					super.onSuccess(arg0);
					Log.d("create success folder", arg0);
					Log.d("from success", "get json");
					PluginResult progressResult = new PluginResult(
							PluginResult.Status.OK, arg0);
					progressResult.setKeepCallback(true);
					callbackContext1.sendPluginResult(progressResult);
					//Toast.makeText(context, "post response", Toast.LENGTH_LONG)
						//	.show();

					Log.d("from success", "from success");
				}

				@Override
				public void onFinish() {
					super.onFinish();
					Log.d("from finish", "from finish");
				//	Toast.makeText(context, "post finish", Toast.LENGTH_LONG)
						//	.show();

				}

				@Override
				public void onFailure(Throwable arg0, String arg1) {

					if (arg0.getCause() instanceof ConnectTimeoutException) {
					//	Toast.makeText(context, "Connection timeout !",
							//	Toast.LENGTH_LONG).show();
					}
				//	Toast.makeText(context, "post failure", Toast.LENGTH_LONG)
					//		.show();

					Log.d("argo", arg1);
					Log.d("onFailure", "onFailure");
					super.onFailure(arg0, arg1);
				}

			});
		}

	}

	@SuppressLint("NewApi")
	private ArrayList<CustomGallery> getGalleryPhotos() {

		try {
			String[] projection = { MediaStore.Files.FileColumns._ID,
					MediaStore.Files.FileColumns.DATA,
					MediaStore.Files.FileColumns.DATE_ADDED,
					MediaStore.Files.FileColumns.MEDIA_TYPE,
					MediaStore.Files.FileColumns.MIME_TYPE,
					MediaStore.Files.FileColumns.TITLE };

			String selection = MediaStore.Files.FileColumns.MEDIA_TYPE + "="
					+ MediaStore.Files.FileColumns.MEDIA_TYPE_IMAGE + " OR "
					+ MediaStore.Files.FileColumns.MEDIA_TYPE + "="
					+ MediaStore.Files.FileColumns.MEDIA_TYPE_VIDEO;

			// Log.d("selection", selection);
			Uri queryUri = null;
			Cursor imagecursor = null;
			if (Build.VERSION.SDK_INT < Build.VERSION_CODES.HONEYCOMB) {

				final String[] columns = { MediaStore.Images.Media.DATA,
						MediaStore.Images.Media._ID };
				final String orderBy = MediaStore.Images.Media._ID;
				imagecursor = context.getContentResolver().query(
						MediaStore.Images.Media.EXTERNAL_CONTENT_URI, columns,
						null, null, orderBy);

			} else {

				queryUri = MediaStore.Files.getContentUri("external");
				// Log.d("query", queryUri.toString());
				Log.d("android", "general");
				CursorLoader cursorLoader = new CursorLoader(context, queryUri,
						projection, selection, null,
						MediaStore.Files.FileColumns.DATE_ADDED + " DESC"

				);

				imagecursor = cursorLoader.loadInBackground();

			}

			if (imagecursor != null && imagecursor.getCount() > 0) {

				for (int index = 0; index < imagecursor.getCount(); index++) {
					imagecursor.moveToPosition(index);
					CustomGallery item = new CustomGallery();
					Boolean isVideo = imagecursor
							.getString(
									imagecursor
											.getColumnIndex(MediaStore.Images.Media._ID))
							.length() > 0;
					Log.d("TAG", "isVideo: " + isVideo);

					if (isVideo) {
						item.sdcardPath = imagecursor
								.getString(imagecursor
										.getColumnIndex(MediaStore.Video.Thumbnails.DATA));

						data.add(item);
					} else {
						item.sdcardPath = imagecursor.getString(imagecursor
								.getColumnIndex(MediaStore.Images.Media.DATA));
						data.add(item);
						// Log.d("TAG", String.valueOf(index) + "1");
					}
					Log.d("TAG", "mediaPath: ");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return data;
	}
	
	private String getImagePath(String name) {
		// TODO Auto-generated method stub
		String stng = null;
		Log.e(TAG, "file name:" + name);
		Uri mUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
		String[] cloumns = { MediaStore.Images.ImageColumns.DATA,
				MediaStore.Images.ImageColumns._ID,
				MediaStore.Images.ImageColumns.TITLE,
				MediaStore.Images.Thumbnails.DATA };
		String selection = MediaStore.Images.Media.DATA + " Like '%" + name
				+ "'";
		Cursor Imagecursor = cordova.getActivity()
				.managedQuery(mUri, cloumns, selection, null, null);
		if (Imagecursor.getCount() > 0) {
			Imagecursor.moveToFirst();
			while (!Imagecursor.isAfterLast()) {
				String path = Imagecursor.getString(0);
				Log.e(TAG, "path:" + path);
				String[] temp = path.split("/");
				if (temp[temp.length - 1].equalsIgnoreCase(name)) {
					stng = path;
					Log.d("path", path);
					return path;
				}
				Imagecursor.moveToNext();
			}

		} else {
			return stng;
		}
		return stng;
	}

}

// function(e){alert(e);},"Echo", "echo", ["640", "480",
// document.getElementById("videoUpload").value])


