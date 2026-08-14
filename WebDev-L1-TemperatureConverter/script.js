document.addEventListener("DOMContentLoaded", () => {
  const temperatureInput = document.getElementById("temperature");
  const unitSelect = document.getElementById("unit");
  const convertBtn = document.getElementById("convertBtn");

  const celsiusResult = document.getElementById("celsiusResult");
  const fahrenheitResult = document.getElementById("fahrenheitResult");
  const kelvinResult = document.getElementById("kelvinResult");
  const errorMessage = document.getElementById("errorMessage");

  // Convert temperature between Celsius, Fahrenheit, and Kelvin
  const convertTemperature = () => {
    const value = parseFloat(temperatureInput.value);
    const unit = unitSelect.value;

    errorMessage.textContent = "";
    errorMessage.classList.remove("show-error");

    if (temperatureInput.value.trim() === "" || Number.isNaN(value)) {
      errorMessage.textContent = "Please enter a valid number.";
      errorMessage.classList.add("show-error");
      return;
    }

    let celsius;

    if (unit === "celsius") {
      celsius = value;
    } else if (unit === "fahrenheit") {
      celsius = (value - 32) * 5 / 9;
    } else if (unit === "kelvin") {
      celsius = value - 273.15;
    }

    if (celsius < -273.15) {
      errorMessage.textContent =
        "Temperature cannot be below absolute zero (-273.15°C).";

      errorMessage.classList.add("show-error");
      return;
    }

    const fahrenheit = (celsius * 9 / 5) + 32;
    const kelvin = celsius + 273.15;

    // Display the results
    celsiusResult.textContent = `${celsius.toFixed(2)} °C`;
    fahrenheitResult.textContent = `${fahrenheit.toFixed(2)} °F`;
    kelvinResult.textContent = `${kelvin.toFixed(2)} K`;

    const resultCards = document.querySelectorAll(".result-card");

    resultCards.forEach((card, index) => {
      card.classList.remove("show-result");

      void card.offsetWidth;

      setTimeout(() => {
        card.classList.add("show-result");
      }, index * 80);
    });
  };

  convertBtn.addEventListener("click", convertTemperature);

  temperatureInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      convertTemperature();
    }
  });

  unitSelect.addEventListener("change", () => {
    unitSelect.classList.remove("unit-changed");

    void unitSelect.offsetWidth;

    unitSelect.classList.add("unit-changed");
  });
});