<html>
<head>
    <meta charset="UTF-8">
    <title>Untitled Document</title>
    <style>
   img {
    width: 100%;
    height: 100%;
}
        
/********************************************
 Additional styles for the explanation boxes 
*********************************************/

    </style>

</head>
<body>
<form action="upload.php" method="post" enctype="multipart/form-data">
    Select image to upload:
    <input type="file" name="fileToUpload" id="fileToUpload">
    <input type="submit" value="Upload Image" name="submit">
    <?php     
    echo "<input type='hidden' value='tmp' name='$_GET['user']'>"
    ?>
    <input type="hidden" value="tmp" name="user">
</form>
<div>
  <!-- <img src="Ad_Size/icon-768x1024.png"></img> -->
  </div>
</body>
</html>