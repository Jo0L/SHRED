$(document).ready(function() {
    window.weatherWidgetConfig = window.weatherWidgetConfig || [];
        window.weatherWidgetConfig.push({
            selector: ".weatherWidget",
            apiKey: "KB3NE8VRBLVAQ8L88WVUYQPLF", // Replace with your API key
            location: "Jerusalem, Israel", // Location for the weather forecast
            unitGroup: "metric", // "us" for Fahrenheit, "metric" for Celsius
            forecastDays: 5, // Number of forecast days
            title: "Jerusalem, Israel", // Optional title
            showTitle: true,
            showConditions: true
        });

        (function () {
            var d = document, s = d.createElement('script');
            s.src = 'https://www.visualcrossing.com/widgets/forecast-simple/weather-forecast-widget-simple.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        })();
});