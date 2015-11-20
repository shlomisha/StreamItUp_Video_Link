// ==UserScript==
// @id             HUJI_Stream_It_Up_Video_Link
// @name           StreamItUp Video Link
// @version        1.1.1
// @namespace      shlomisha
// @author         shlomisha
// @description    Shows the lectures links, in streamitup.com systems, so it is easier to download them, or watch them in other OS than Windows
// @include        http://www.streamitup.com/elearning/*/vod_student_window_E.php
// @include        http://www.streamitup.com/huji_db/*
// @include        http://www.streamitupcdn.net/huji_db/database/vod_student_window_E.php
// @grant          GM_addStyle
// @run-at         document-end
// @updateURL      https://raw.githubusercontent.com/shlomisha/StreamItUp_Video_Link/master/StreamItUp_Video_Link.meta.js
// @downloadURL    https://raw.githubusercontent.com/shlomisha/StreamItUp_Video_Link/master/StreamItUp_Video_Link.user.js
// ==/UserScript==

var EMPTY_VIDEO_NAME = "blankvideo.wmv";

// Setting the style needed
GM_addStyle(
	"#divMmsLinks { direction: rtl; text-align: center; font-size: 12pt; font-family: arial; margin: 0.5em 0; } \
	table.TableData { width: 90%; margin: 0 auto; border: 2px solid black; } \
	table.TableData tr th, table.TableData tr td { border: 1px solid black; padding: 0; } \
	table.TableData tr td.ID { width: 10%; } \
	table.TableData tr td.Link { width: 40%; } \
	table.TableData tr td.View { width: 5%; } \
	table.TableData tr td.View a { color: blue; display: block; } \
	table.TableData tr td.Link input { width: 95%; } \
	p.Right { float: right; width: 40%; margin-right: 10%; } \
	p.Left { float: left; width: 40%; margin-left: 10%; direction: ltr; } \
	div.Clear { clear: both; } "
);

// The movies are listed in an array, each item is an object containing the data
var movies = unsafeWindow.chapters_data;
if (movies == null)
{
	return;
}

var div = document.createElement("div");
div.id = "divMmsLinks";

var header = "<p class=\"Right\"> \
	קישורים ישירים לסרטונים (פרוטוקול mms): \
	<br /> \
	הורדה או צפייה באמצעות VLC, mplayer או כל נגן אחר שמכבד את עצמו. </p> \
	<p class=\"Left\"> \
	Direct links for the videos (mms protocol): <br /> \
	Watch or download using VLC, mplayer or other media players. \
	</p> \
	<div class=\"Clear\"></div>";

var table = "<table class=\"TableData\">";
table += "<tr>";
table += "	<th> פרק <br /> Part</th>";
table += "	<th colspan=\"2\"> מסך המחשב <br /> Computer Screen</th>";
table += "	<th colspan=\"2\"> לוח <br /> Board </th>";
table += "</tr>";

var screenPath;
var boardPath;
var videoUrl;
for (var i = 0; i < movies.length; i++)
{
	if (movies[i].full_scr_path.indexOf(EMPTY_VIDEO_NAME) >= 0)
	{
		screenPath = "-";
		screenPathView = "-";
	}
	else
	{
		videoUrl = (movies[i].full_scr_path.indexOf("rtsp://") == 0 ? movies[i].full_other_path.replace("/video/cam_", "/video/screen_") : movies[i].full_scr_path);
		screenPath = "<input type=\"text\" value=\"" + videoUrl + "\" onfocus=\"this.select();\" readonly=\"readonly\" />";
		screenPathView = "<a href=\"" + videoUrl + "\" target=\"_blank\">צפיה<br />view</a>";
	}
	
	if (movies[i].full_cam_path.indexOf(EMPTY_VIDEO_NAME) >= 0)
	{
		boardPath = "-";
		boardPathView = "-";
	}
	else
	{
		videoUrl = (movies[i].full_scr_path.indexOf("rtsp://") == 0 ? movies[i].full_other_path : movies[i].full_scr_path);
		boardPath = "<input type=\"text\" value=\"" + videoUrl + "\" onfocus=\"this.select();\" readonly=\"readonly\" />";
		boardPathView = "<a href=\"" + videoUrl + "\" target=\"_blank\">צפיה<br />view</a>";
	}
	
	table += "<tr>\
				<td class=\"ID\"> " + (i + 1) + " </td>\
				<td class=\"Link\"> " + screenPath + " </td>\
				<td class=\"View\"> " + screenPathView + " </td>\
				<td class=\"Link\"> " + boardPath + " </td>\
				<td class=\"View\"> " + boardPathView + " </td>\
			</tr>";
}

table += "</table>";
div.innerHTML = header + table;

document.body.insertBefore(div, document.body.firstChild);

// Hides the annoying "Install Microsoft Silverlight" baner (Why should Someone do so? yack..)
// There are two versions, one is { big, small } and the second is { one, two }. Checking for both
if (document.getElementById("big") != null)
{
	document.getElementById("big").style.display = "none";
	document.getElementById("small").style.display = "none";
}
if (document.getElementById("one") != null)
{
	document.getElementById("one").style.display = "none";
	document.getElementById("two").style.display = "none";
}
if (document.getElementById("big_back") != null)
{
	document.getElementById("big_back").style.display = "none";
	document.getElementById("small_back").style.display = "none";
}
