<?php
$user=$_POST['user'];
$date=$_POST['scheduleDate'];
$assign=$_POST['assign'];
if (!file_exists('uploads/'.$user.'/')) {
    $oldmask = umask(0);
    $cf = mkdir('uploads/'.$user.'/',0777);
    umask($oldmask);
}

$target_dir = "uploads/".$user.'/';
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if($check !== false) {
        $message = "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        $message = "Sorry, the file is not an image.";
        $uploadOk = 0;
    }
}
// Check if file already exists
// if (file_exists($target_file)) {
//     echo "Sorry, file already exists.";
//     $uploadOk = 0;
// }
// Check file size
if ($_FILES["fileToUpload"]["size"] > 5000000) {
    $message = "Sorry, your file is too large.";
    $uploadOk = 0;
}
// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif" && $imageFileType != "PNG" ) {
    $message = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    $message = "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        $message = "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";        
    } else {
        $message = "Sorry, there was an error uploading your file.";
    }
}

if(preg_match("/sorry/i", $message)){
    echo "<script src='js/jquery-1.8.3.min.js'></script>";
    echo "<script src='js/loginWithAPI.js'></script>";
    echo "<script type='text/javascript'>alert('$message');</script>";    
}else{
   // Create index.html 
    $datetsp = new DateTime();
    $datetsp = $datetsp->getTimestamp();
    $myfile = fopen('uploads/'.$user.'/'."/".$datetsp.".html", "w") or die("Unable to open file!");
    $txt = "<html><head><meta charset=\"UTF-8\"><title>Untitled Document</title><style>img{width: 100%;height: 100%;}</style></head><body><div><img src=".basename( $_FILES["fileToUpload"]["name"])."></img></div></body></html>";
    fwrite($myfile, $txt);
    fclose($myfile);
    echo "<script src='js/jquery-1.8.3.min.js'></script>";
    echo "<script src='js/loginWithAPI.js'></script>";
    echo $assign."\n";
    if(preg_match("/1/i", $assign)){
        echo "<script type='text/javascript'>setSchedule('$user', "."'http://tarsanad.ddns.net/NiceAdmin/"."$target_dir".$datetsp.".html','".$date."');getAllMachine();alert('$message');</script>";    
        echo $datetsp." "."setSchedule('$user', "."'http://tarsanad.ddns.net/NiceAdmin/"."$target_dir".$datetsp.".html,".$date.");";
    }else{
        echo "<script type='text/javascript'>setPageUrl('$user', "."'http://tarsanad.ddns.net/NiceAdmin/"."$target_dir"."index.html'".");getAllMachine();alert('$message');</script>";    
    }
}


// header ("Location: "."http://tarsanad.ddns.net/NiceAdmin/status.html");
echo "<script>window.location.replace('http://tarsanad.ddns.net/NiceAdmin/status.html');</script>";
?>