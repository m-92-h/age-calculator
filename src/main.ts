import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style.css";

// Interface for age
interface AgeResult {
    years: number;
    months: number;
    days: number;
}

document.addEventListener("DOMContentLoaded", (): void => {
    const form = document.getElementById("age-form") as HTMLFormElement;
    const dayInput = document.getElementById("day-input") as HTMLInputElement;
    const monthInput = document.getElementById("month-input") as HTMLInputElement;
    const yearInput = document.getElementById("year-input") as HTMLInputElement;
    const resultYears = document.getElementById("result-years") as HTMLSpanElement;
    const resultMonths = document.getElementById("result-months") as HTMLSpanElement;
    const resultDays = document.getElementById("result-days") as HTMLSpanElement;

    // Function to display error messages
    function displayError(inputElement: HTMLInputElement, errorElement: HTMLElement | null, message: string): void {
        inputElement.classList.add("is-invalid");
        if (errorElement) errorElement.textContent = message;
        const label = inputElement.previousElementSibling as HTMLElement | null;
        if (label) label.style.color = "hsl(0, 100%, 67%)";
    }

    function clearError(inputElement: HTMLInputElement, errorElement: HTMLElement | null): void {
        inputElement.classList.remove("is-invalid");
        if (errorElement) errorElement.textContent = "";
        const label = inputElement.previousElementSibling as HTMLElement | null;
        if (label) label.style.color = "hsl(0, 1%, 44%)";
    }

    // Function to validate user inputs
    function validateInputs(day: string, month: string, year: string): boolean {
        let isValid: boolean = true;
        const inputElements: HTMLInputElement[] = [dayInput, monthInput, yearInput];

        inputElements.forEach((input) => clearError(input, document.getElementById(`${input.id.replace("-input", "-error")}`)));

        if (day === "") {
            displayError(dayInput, document.getElementById("day-error"), "This field is required");
            isValid = false;
        }
        if (month === "") {
            displayError(monthInput, document.getElementById("month-error"), "This field is required");
            isValid = false;
        }
        if (year === "") {
            displayError(yearInput, document.getElementById("year-error"), "This field is required");
            isValid = false;
        }

        if (!isValid) return false;

        const d: number = parseInt(day);
        const m: number = parseInt(month);
        const y: number = parseInt(year);
        const today: Date = new Date();

        if (d < 1 || d > 31) {
            displayError(dayInput, document.getElementById("day-error"), "Must be a valid day");
            isValid = false;
        }
        if (m < 1 || m > 12) {
            displayError(monthInput, document.getElementById("month-error"), "Must be a valid month");
            isValid = false;
        }
        if (y > today.getFullYear()) {
            displayError(yearInput, document.getElementById("year-error"), "Must be in the past");
            isValid = false;
        }

        if (!isValid) return false;

        const inputDate: Date = new Date(y, m - 1, d);

        if (inputDate > today) {
            displayError(dayInput, document.getElementById("day-error"), "Date must be in the past");
            displayError(monthInput, document.getElementById("month-error"), "");
            displayError(yearInput, document.getElementById("year-error"), "");
            return false;
        }

        if (inputDate.getFullYear() !== y || inputDate.getMonth() !== m - 1 || inputDate.getDate() !== d) {
            displayError(dayInput, document.getElementById("day-error"), "Must be a valid date");
            displayError(monthInput, document.getElementById("month-error"), "");
            displayError(yearInput, document.getElementById("year-error"), "");
            return false;
        }

        return true;
    }

    // Function to calculate age
    function calculateAge(birthDay: number, birthMonth: number, birthYear: number): AgeResult {
        const today: Date = new Date();
        const birthDate: Date = new Date(birthYear, birthMonth - 1, birthDay);

        let years: number = today.getFullYear() - birthDate.getFullYear();
        let months: number = today.getMonth() - birthDate.getMonth();
        let days: number = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth: Date = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months, days };
    }

    // Function to update the results display
    function updateResults(age: AgeResult): void {
        const duration: number = 1500;
        const step: number = 20;
        const steps: number = duration / step;

        const animate = (targetElement: HTMLElement, finalValue: number): void => {
            let start: number = 0;
            const increment: number = Math.ceil(finalValue / steps);

            const timer = setInterval((): void => {
                start += increment;
                if (start >= finalValue) {
                    clearInterval(timer);
                    start = finalValue;
                }
                targetElement.textContent = String(start);
            }, step);
        };

        resultYears.textContent = "--";
        resultMonths.textContent = "--";
        resultDays.textContent = "--";

        animate(resultYears, age.years);
        animate(resultMonths, age.months);
        animate(resultDays, age.days);
    }

    form.addEventListener("submit", (e: SubmitEvent): void => {
        e.preventDefault();

        const day: string = dayInput.value;
        const month: string = monthInput.value;
        const year: string = yearInput.value;

        if (validateInputs(day, month, year)) {
            const age: AgeResult = calculateAge(parseInt(day), parseInt(month), parseInt(year));
            updateResults(age);
        } else {
            resultYears.textContent = "--";
            resultMonths.textContent = "--";
            resultDays.textContent = "--";
        }
    });
});
