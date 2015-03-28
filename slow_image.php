<?php

sleep(7);

$imagepath="imgs\Men\drill.jpg";

$image=imagecreatefromjpeg($imagepath);

header('Content-Type: image/jpeg');

imagejpeg($image);

?>
