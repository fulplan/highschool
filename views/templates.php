<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />

    <title>HighSchoolive Africa</title>
    <meta content="" name="The Edutainment centre" />
    <meta content="" name="keywords" />

    <!-- Favicons -->
    <link href="views/img/high-logo-mini.png" rel="icon" />
    <link href="views/img/high-logo.png" rel="high-logo" />

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet" />

    <!-- Vendor CSS Files -->
    <link href="views/vendor/animate.css/animate.min.css" rel="stylesheet" />
    <link href="views/vendor/aos/aos.css" rel="stylesheet" />
    <link href="views/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
    <link href="views/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet" />
    <link href="views/vendor/boxicons/css/boxicons.min.css" rel="stylesheet" />
    <link href="views/vendor/glightbox/css/glightbox.min.css" rel="stylesheet" />
    <link href="views/vendor/swiper/swiper-bundle.min.css" rel="stylesheet" />

    <!-- Template Main CSS File -->
    <link href="views/css/style.css" rel="stylesheet" />

    <!-- Vendor JS Files -->
    <script src="views/vendor/aos/aos.js"></script>
    <script src="views/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="views/vendor/glightbox/js/glightbox.min.js"></script>
    <script src="views/vendor/isotope-layout/isotope.pkgd.min.js"></script>
    <script src="views/vendor/php-email-form/validate.js"></script>
    <script src="views/vendor/swiper/swiper-bundle.min.js"></script>


    <!-- PRELOAD  -->


    <!-- Video Play -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css" />
    <link rel="stylesheet" href="views/css/video.css">



</head>


<body id="page">
    <?php
    // ======= Top Bar =======
    include "modules/navbar.php";
    // <!-- End Top Bar -->

    // HEADER SECTIONS
    include "modules/header.php";
    // <!-- =============================================== -->

    // BACKGROUND SECTION
    include "modules/bg-section.php";
    // include "modules/bg2-section.php";
    // include "modules/bg-video.php";
    ?>

    <main id="main">
        <?php
        // <!-- ======= About Section ======= -->
        include "modules/about-us.php";
        // <!-- End About Section -->

        // <!-- ======= Why Us Section ======= -->
        include "modules/why-us.php";

        // <!-- End Why Us Section -->


        // <!-- ======= Menu Section ======= -->
        // <!-- End Menu Section -->

        // <!-- ======= Specials Section ======= -->
        // <!-- End Specials Section -->


        // <!-- Start Event Section -->
        // <!-- End Events Section -->


        // <!-- ======= Book A Event Section ======= -->
        include "modules/event.php";
        // <!-- End Book A Event Section -->


        // <!-- Testimonials Section -->
        include "modules/members.php";
        // <!-- End Testimonials Section -->



        // <!-- ======= Gallery Section ======= -->
        include "modules/photos.php";
        // <!-- End Gallery Section -->



        // <!-- Contact Start Here -->
        include "modules/contact.php";
        // <!-- End Contact Section -->

        ?>
    </main>
    <!-- End #main -->


    <!-- Footer -->
    <?php
    include "modules/footer.php";
    ?>
    <!-- End Footer -->



    <!-- <div id="preloader"></div> -->
    <div id="loading">
        <div id="loading-center">
            <div id="loading-center-absolute">
                <div class="object" id="object_one"></div>
                <div class="object" id="object_two"></div>
                <div class="object" id="object_three"></div>
                <div class="object" id="object_four"></div>
                <div class="object" id="object_five"></div>
                <div class="object" id="object_six"></div>
                <div class="object" id="object_seven"></div>
                <div class="object" id="object_eight"></div>
                <div class="object" id="object_big"></div>
            </div>
        </div>
    </div>

    <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>



    <!-- Template Main JS File -->
    <script src="views/js/main.js"></script>
    <script src="views/js/preload-scripts/pre-query.js"></script>
    <script src="views/js/preload-scripts/preload.js"></script>
    <script src="views/js/video.js"></script>
</body>

</html>