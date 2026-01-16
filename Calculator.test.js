import { describe, it, expect, beforeEach } from 'vitest';
import { Calculator } from './Calculator.js';

describe('Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    describe('getDisplay', () => {
        it('должен возвращать начальное значение "0"', () => {
            expect(calculator.getDisplay()).toBe('0');
        });

        it('должен возвращать текущее значение после операций', () => {
            calculator.appendNumber('5');
            expect(calculator.getDisplay()).toBe('5');
        });
    });

    describe('appendNumber', () => {
        it('должен заменять "0" на введенное число', () => {
            calculator.appendNumber('5');
            expect(calculator.getDisplay()).toBe('5');
        });

        it('должен добавлять число к существующему значению', () => {
            calculator.appendNumber('5');
            calculator.appendNumber('3');
            expect(calculator.getDisplay()).toBe('53');
        });

        it('должен сбрасывать дисплей после вычисления', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.appendNumber('2');
            expect(calculator.getDisplay()).toBe('2');
        });

        it('должен обрабатывать несколько цифр подряд', () => {
            calculator.appendNumber('1');
            calculator.appendNumber('2');
            calculator.appendNumber('3');
            expect(calculator.getDisplay()).toBe('123');
        });
    });

    describe('appendDecimal', () => {
        it('должен добавлять десятичную точку к числу', () => {
            calculator.appendNumber('5');
            calculator.appendDecimal();
            expect(calculator.getDisplay()).toBe('5.');
        });

        it('должен добавлять точку к нулю', () => {
            calculator.appendDecimal();
            expect(calculator.getDisplay()).toBe('0.');
        });

        it('не должен добавлять вторую точку', () => {
            calculator.appendNumber('5');
            calculator.appendDecimal();
            calculator.appendNumber('3');
            calculator.appendDecimal();
            expect(calculator.getDisplay()).toBe('5.3');
        });

        it('должен сбрасывать дисплей после вычисления перед добавлением точки', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.appendDecimal();
            expect(calculator.getDisplay()).toBe('0.');
        });
    });

    describe('appendOperator', () => {
        it('должен добавлять оператор сложения', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            expect(calculator.getDisplay()).toBe('5+');
        });

        it('должен добавлять оператор вычитания', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('-');
            expect(calculator.getDisplay()).toBe('5-');
        });

        it('должен добавлять оператор умножения', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('*');
            expect(calculator.getDisplay()).toBe('5*');
        });

        it('должен добавлять оператор деления', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('/');
            expect(calculator.getDisplay()).toBe('5/');
        });

        it('должен заменять существующий оператор новым', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendOperator('-');
            expect(calculator.getDisplay()).toBe('5-');
        });

        it('должен заменять оператор несколько раз подряд', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendOperator('-');
            calculator.appendOperator('*');
            expect(calculator.getDisplay()).toBe('5*');
        });

        it('должен сбрасывать флаг shouldResetDisplay при добавлении оператора', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.appendOperator('+');
            expect(calculator.getDisplay()).toBe('8+');
        });
    });

    describe('calculate', () => {
        describe('Положительные сценарии', () => {
            it('должен выполнять сложение', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('3');
                const result = calculator.calculate();
                expect(result).toBe('8');
                expect(calculator.getDisplay()).toBe('8');
            });

            it('должен выполнять вычитание', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('-');
                calculator.appendNumber('3');
                const result = calculator.calculate();
                expect(result).toBe('7');
            });

            it('должен выполнять умножение', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('*');
                calculator.appendNumber('3');
                const result = calculator.calculate();
                expect(result).toBe('15');
            });

            it('должен выполнять деление', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('2');
                const result = calculator.calculate();
                expect(result).toBe('5');
            });

            it('должен обрабатывать десятичные числа', () => {
                calculator.appendNumber('5');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('2');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                const result = calculator.calculate();
                expect(parseFloat(result)).toBeCloseTo(8, 5);
            });

            it('должен обрабатывать сложные выражения', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('+');
                calculator.appendNumber('5');
                calculator.appendOperator('*');
                calculator.appendNumber('2');
                const result = calculator.calculate();
                // Умножение имеет приоритет: 10+5*2 = 10+10 = 20
                expect(result).toBe('20');
            });

            it('должен обрабатывать отрицательные результаты', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('-');
                calculator.appendNumber('10');
                const result = calculator.calculate();
                expect(result).toBe('-5');
            });

            it('должен обрабатывать деление с десятичным результатом', () => {
                calculator.appendNumber('1');
                calculator.appendOperator('/');
                calculator.appendNumber('3');
                const result = calculator.calculate();
                expect(parseFloat(result)).toBeCloseTo(0.3333333333333333, 10);
            });

            it('должен обрабатывать большие числа', () => {
                calculator.appendNumber('999');
                calculator.appendOperator('*');
                calculator.appendNumber('999');
                const result = calculator.calculate();
                expect(result).toBe('998001');
            });
        });

        describe('Отрицательные сценарии', () => {
            it('должен возвращать "Ошибка" при делении на ноль', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
                expect(calculator.getDisplay()).toBe('Ошибка');
            });

            it('должен возвращать "Ошибка" при делении на ноль в сложном выражении', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('+');
                calculator.appendNumber('5');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('не должен считать деление на 0.0 как ошибку', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                const result = calculator.calculate();
                expect(parseFloat(result)).toBeCloseTo(20, 5);
            });

            it('должен обрабатывать некорректные выражения', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendOperator('+');
                calculator.appendOperator('+');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен обрабатывать пустое выражение', () => {
                calculator.appendOperator('+');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен обрабатывать только оператор без чисел', () => {
                calculator.appendOperator('/');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен устанавливать флаг shouldResetDisplay после вычисления', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('3');
                calculator.calculate();
                expect(calculator.shouldResetDisplay).toBe(true);
            });

            it('должен устанавливать флаг shouldResetDisplay при ошибке', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                calculator.calculate();
                expect(calculator.shouldResetDisplay).toBe(true);
            });
        });
    });

    describe('clearDisplay', () => {
        it('должен сбрасывать значение на "0"', () => {
            calculator.appendNumber('5');
            calculator.clearDisplay();
            expect(calculator.getDisplay()).toBe('0');
        });

        it('должен сбрасывать сложное выражение', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.clearDisplay();
            expect(calculator.getDisplay()).toBe('0');
        });

        it('должен сбрасывать флаг shouldResetDisplay', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.clearDisplay();
            expect(calculator.shouldResetDisplay).toBe(false);
        });

        it('должен работать после ошибки', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('/');
            calculator.appendNumber('0');
            calculator.calculate();
            calculator.clearDisplay();
            expect(calculator.getDisplay()).toBe('0');
        });
    });

    describe('deleteLast', () => {
        it('должен удалять последний символ', () => {
            calculator.appendNumber('5');
            calculator.appendNumber('3');
            calculator.deleteLast();
            expect(calculator.getDisplay()).toBe('5');
        });

        it('должен удалять оператор', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.deleteLast();
            expect(calculator.getDisplay()).toBe('5');
        });

        it('должен удалять десятичную точку', () => {
            calculator.appendNumber('5');
            calculator.appendDecimal();
            calculator.deleteLast();
            expect(calculator.getDisplay()).toBe('5');
        });

        it('должен оставлять "0" если удалить последнюю цифру из однозначного числа', () => {
            calculator.appendNumber('5');
            calculator.deleteLast();
            expect(calculator.getDisplay()).toBe('0');
        });

        it('должен вызывать clearDisplay если shouldResetDisplay установлен', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.deleteLast();
            expect(calculator.getDisplay()).toBe('0');
            expect(calculator.shouldResetDisplay).toBe(false);
        });

        it('должен удалять несколько символов подряд', () => {
            calculator.appendNumber('1');
            calculator.appendNumber('2');
            calculator.appendNumber('3');
            calculator.deleteLast();
            calculator.deleteLast();
            expect(calculator.getDisplay()).toBe('1');
        });
    });

    describe('Интеграционные тесты', () => {
        it('должен выполнять последовательность операций', () => {
            calculator.appendNumber('10');
            calculator.appendOperator('+');
            calculator.appendNumber('5');
            calculator.calculate();
            calculator.appendOperator('*');
            calculator.appendNumber('2');
            const result = calculator.calculate();
            expect(result).toBe('30');
        });

        it('должен обрабатывать цепочку вычислений', () => {
            calculator.appendNumber('2');
            calculator.appendOperator('+');
            calculator.appendNumber('2');
            calculator.calculate();
            calculator.appendOperator('*');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.appendOperator('-');
            calculator.appendNumber('2');
            const result = calculator.calculate();
            expect(result).toBe('10');
        });

        it('должен корректно работать после очистки', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.clearDisplay();
            calculator.appendNumber('10');
            calculator.appendOperator('/');
            calculator.appendNumber('2');
            const result = calculator.calculate();
            expect(result).toBe('5');
        });

        it('должен обрабатывать операции с десятичными числами', () => {
            calculator.appendNumber('0');
            calculator.appendDecimal();
            calculator.appendNumber('1');
            calculator.appendOperator('+');
            calculator.appendNumber('0');
            calculator.appendDecimal();
            calculator.appendNumber('2');
            const result = calculator.calculate();
            expect(parseFloat(result)).toBeCloseTo(0.3, 5);
        });
    });
});
