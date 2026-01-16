/**
 * Класс Calculator для выполнения математических операций
 */
export class Calculator {
    constructor() {
        this.currentInput = '0';
        this.shouldResetDisplay = false;
    }

    /**
     * Обновляет отображение (для тестирования возвращает текущее значение)
     * @returns {string} Текущее значение
     */
    getDisplay() {
        return this.currentInput;
    }

    /**
     * Добавляет число к текущему вводу
     * @param {string} number - Цифра для добавления
     */
    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }
        
        if (this.currentInput === '0') {
            this.currentInput = number;
        } else {
            this.currentInput += number;
        }
    }

    /**
     * Добавляет десятичную точку
     */
    appendDecimal() {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }
        
        // Находим последнее число (после последнего оператора)
        const operators = ['+', '-', '*', '/'];
        let lastOperatorIndex = -1;
        for (let i = this.currentInput.length - 1; i >= 0; i--) {
            if (operators.includes(this.currentInput[i])) {
                lastOperatorIndex = i;
                break;
            }
        }
        
        const lastNumber = lastOperatorIndex === -1 
            ? this.currentInput 
            : this.currentInput.substring(lastOperatorIndex + 1);
        
        if (!lastNumber.includes('.')) {
            this.currentInput += '.';
        }
    }

    /**
     * Добавляет оператор к текущему вводу
     * @param {string} operator - Оператор (+, -, *, /)
     */
    appendOperator(operator) {
        if (this.shouldResetDisplay) {
            this.shouldResetDisplay = false;
        }
        
        const lastChar = this.currentInput[this.currentInput.length - 1];
        if (['+', '-', '*', '/'].includes(lastChar)) {
            this.currentInput = this.currentInput.slice(0, -1) + operator;
        } else {
            this.currentInput += operator;
        }
    }

    /**
     * Выполняет вычисление текущего выражения
     * @returns {string} Результат вычисления или 'Ошибка'
     */
    calculate() {
        try {
            // Заменяем × на * для вычисления
            let expression = this.currentInput.replace(/×/g, '*');
            
            // Проверяем на деление на ноль
            if (expression.includes('/0') && !expression.includes('/0.')) {
                this.currentInput = 'Ошибка';
                this.shouldResetDisplay = true;
                return 'Ошибка';
            }
            
            const result = Function('"use strict"; return (' + expression + ')')();
            
            if (isNaN(result) || !isFinite(result)) {
                this.currentInput = 'Ошибка';
                this.shouldResetDisplay = true;
                return 'Ошибка';
            } else {
                this.currentInput = result.toString();
            }
            
            this.shouldResetDisplay = true;
            return this.currentInput;
        } catch (error) {
            this.currentInput = 'Ошибка';
            this.shouldResetDisplay = true;
            return 'Ошибка';
        }
    }

    /**
     * Очищает дисплей
     */
    clearDisplay() {
        this.currentInput = '0';
        this.shouldResetDisplay = false;
    }

    /**
     * Удаляет последний символ
     */
    deleteLast() {
        if (this.shouldResetDisplay) {
            this.clearDisplay();
            return;
        }
        
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
    }
}
