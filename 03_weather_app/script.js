async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "YOUR_API_KEY";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();
  document.getElementById("weatherResult").innerHTML =
    `Temp: ${data.main.temp}°C<br>Weather: ${data.weather[0].description}`;
}