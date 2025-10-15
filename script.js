document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('age-form');
    const dayInput = document.getElementById('day-input');
    const monthInput = document.getElementById('month-input');
    const yearInput = document.getElementById('year-input');

    const resultYears = document.getElementById('result-years');
    const resultMonths = document.getElementById('result-months');
    const resultDays = document.getElementById('result-days');

    // Helper to display error state
    function displayError(inputElement, errorElement, message) {
        inputElement.classList.add('is-invalid');
        errorElement.textContent = message;
        const label = inputElement.previousElementSibling;
        if (label) label.style.color = 'hsl(0, 100%, 67%)'; // Red 400
    }

    // Helper to clear error state
    function clearError(inputElement, errorElement) {
        inputElement.classList.remove('is-invalid');
        errorElement.textContent = '';
        const label = inputElement.previousElementSibling; // (previousElementSibling) => It returns the closest sibling element preceding it in the DOM tree. If there is no sibling element preceding it, it returns null.
        if (label) label.style.color = 'hsl(0, 1%, 44%)'; // Grey 500
    }

    // Main Validation Function
    function validateInputs(day, month, year) {
        let isValid = true;
        const currentYear = new Date().getFullYear(); //Extract the current year's date
        const inputElements = [dayInput, monthInput, yearInput];

        // 1. Clear previous errors
        inputElements.forEach(input => clearError(input, document.getElementById(`${input.id.replace('-input', '-error')}`)));

        // 2. Check for empty fields
        if (day === '') {
            displayError(dayInput, document.getElementById('day-error'), 'This field is required');
            isValid = false;
        }
        if (month === '') {
            displayError(monthInput, document.getElementById('month-error'), 'This field is required');
            isValid = false;
        }
        if (year === '') {
            displayError(yearInput, document.getElementById('year-error'), 'This field is required');
            isValid = false;
        }

        // If any required field is empty, stop further checks to avoid parsing errors
        if (!isValid) return false;

        const d = parseInt(day);
        const m = parseInt(month);
        const y = parseInt(year);
        const today = new Date();

        // 3. Check for range limits
        if (d < 1 || d > 31) {
            displayError(dayInput, document.getElementById('day-error'), 'Must be a valid day');
            isValid = false;
        }
        if (m < 1 || m > 12) {
            displayError(monthInput, document.getElementById('month-error'), 'Must be a valid month');
            isValid = false;
        }
        if (y > today.getFullYear()) {
            displayError(yearInput, document.getElementById('year-error'), 'Must be in the past');
            isValid = false;
        }
        
        // Stop if range is invalid before checking date validity
        if (!isValid) return false;

        // 4. Check for future date (if year is current, month/day could still be future)
        const inputDate = new Date(y, m - 1, d); 
        // Date(y, m - 1, d) => Date(year, month, day)
        
        /* 
        Why m - 1? 
        Date objects in JavaScript use zero-based indexing, where:
        The first month (January) is 0.
        The last month (December) is 11.
        Since the user enters the month in a unit-based way (January 1, December 12), we must subtract 1 from the entered value to convert it to JavaScript format.
        Example: If the user enters the month 4 (April), the code passes the value 3 to the function (4 - 1 = 3).
        */ 
        if (inputDate > today) {
            displayError(dayInput, document.getElementById('day-error'), 'Date must be in the past');
            displayError(monthInput, document.getElementById('month-error'), '');
            displayError(yearInput, document.getElementById('year-error'), '');
            return false;
        }

        // 5. Check for valid date (e.g., 31/04/1991 is invalid)
        // Date.getDate() should return the original day if the month/year are correct.
        // If it returns a different day, the date object adjusted it, meaning the input was invalid.
        // E.g., new Date(1991, 3, 31) -> April 31st -> rolls over to May 1st (day 1)
        if (inputDate.getFullYear() !== y || inputDate.getMonth() !== m - 1 || inputDate.getDate() !== d) {
             displayError(dayInput, document.getElementById('day-error'), 'Must be a valid date');
             displayError(monthInput, document.getElementById('month-error'), '');
             displayError(yearInput, document.getElementById('year-error'), '');
             return false;
        }

        return true;
    }

    // Age Calculation Function
    function calculateAge(birthDay, birthMonth, birthYear) {
        const today = new Date();
        const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

        // Calculate years
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        // Adjust for months and days if they're negative such for day (15 - 20 = -5) => errer
        if (days < 0) {
            // Borrow a month
            months--;
            // Calculate the number of days in the previous month
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            // Borrow a year
            years--;
            months += 12;
        }

        return { years, months, days };
    }

    // Update Result Display Function (including the bonus animation)
    function updateResults(age) {
        const duration = 1500; // Animation duration in ms
        const step = 20; // Time step in ms
        const steps = duration / step;
        
        // Simple counter function for the animation
        const animate = (targetElement, finalValue) => {
            let start = 0;
            const increment = Math.ceil(finalValue / steps);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= finalValue) {
                    clearInterval(timer);
                    start = finalValue;
                }
                targetElement.textContent = start;
            }, step);
        };

        // Reset display to '--' for a cleaner animation start
        resultYears.textContent = '--';
        resultMonths.textContent = '--';
        resultDays.textContent = '--';

        // Start animation
        animate(resultYears, age.years);
        animate(resultMonths, age.months);
        animate(resultDays, age.days);
    }

    // Form Submission Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const day = dayInput.value;
        const month = monthInput.value;
        const year = yearInput.value;

        if (validateInputs(day, month, year)) {
            const age = calculateAge(parseInt(day), parseInt(month), parseInt(year));
            updateResults(age);
        } else {
            // Clear results if validation fails
            resultYears.textContent = '--';
            resultMonths.textContent = '--';
            resultDays.textContent = '--';
        }
    });
});