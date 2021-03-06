# Follow My Steps

<div style="width: 100%; text-align: center;">
<img src="https://raw.githubusercontent.com/Rodrigo12/Follow-My-Steps/master/FollowMyStepsAppIcon.png" style="margin: auto;" />
</div>

Welcome to Follow My Steps Web and Mobile project

Follow My Steps is a system, developed for both web and mobile, to study the best way to present visualizations to users, regarding their past experiences based on lifelogging data collected over an extended period of time, in a personally relevant way.
It offers a personalized interface, with 9 different visualizations techniques, built to help users with their forgotten memories or experiences.

This system is divided into two parts, the web-based application and the mobile application.

## Web
The Web Application is focused on displaying the user's data through the use of visualization techniques that can be inserted, edited or deleted, by each user, on the interface.
Initially the system support around 7 types of file formats, which include the CSV, LIFE, XLSX, GPX, JPG, PNG and GIF. You can extend these functionalities by creating new plugins. Furthermore, you can create new visualizations besides the ones implemented, which include the <strong>Map</strong>, the <strong>Bar Chart</strong>, the <strong>Area chart</strong>, the <strong>Line Chart</strong>, the <strong>Pie Chart</strong>, the <strong>Calendar Heatmap</strong>, the <strong>Timeline</strong>, the <strong>Text</strong> and the <strong>images</strong>.

</br>Follow My Steps allow its users to build amazing interfaces like the ones bellow:

<img src="img/financial.png" style="margin: auto; width:300px !important; display:inline-block;" />

<img src="img/travel.png" style="margin: auto; width:300px !important; display:inline-block;" />

To run the web application you need to posteriorly install the PostgreSQL database and its geographical extension PostGIS.
Additionally, you need to have Node.js installed on your machine.

PostgreSQL: https://www.postgresql.org/download/
</br>PostGIS: https://postgis.net/source/
</br>Node.js: https://nodejs.org/en/download/

## Mobile
To use the mobile application you need to have the web application running. It will request the IP and the Port of the server's machine and a random code that will be sent to the web interface.

</br>The mobile interface isn't personalizable, however it helps the users to understand how many times they have been on their current location or on any of it's near locations. It shows several details like the number of times they have been on that specific place and their activities on the last day that they were there.

<img src="img/mobile.png" style="margin: auto; width:300px !important; display:inline-block;" />
