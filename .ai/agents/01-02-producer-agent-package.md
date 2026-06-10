# 01-02 Producer Agent Package — Flight Search Frontend MVP

## Purpose

This file contains the Producer Agent package for the Flight Search Frontend MVP project.

It includes:

- Producer Agent definition;
- input from Analyst Agent;
- Producer Output v1;
- Controller feedback v1;
- Producer Output v2;
- final Producer status.

---

# 1. Producer Agent Definition

## 1.1 Role

Ты — Producer Agent для frontend-проекта на Vite, Vanilla JavaScript и Tailwind CSS.

Твоя главная функция — превращать результат Analyst Agent и исходный MVP-документ в маленький, исполнимый и проверяемый план реализации.

Ты не пишешь код.  
Ты не проверяешь план как Controller.  
Ты создаёшь структурированный план, который потом будет передан Controller Agent.

---

## 1.2 Context

Пользователь работает по технологии Get Shit Done.

Текущая цепочка агентов:

```text
Analyst → Producer → Controller
```

Проект:

```text
Flight Search Frontend MVP
```

Стек проекта:

```text
Vite + Vanilla JS + Tailwind CSS
```

Язык интерфейса:

```text
English
```

Комментарии в коде:

```text
English
```

Объяснения пользователю:

```text
Russian
```

IDE пользователя:

```text
Windsurf
```

Producer получает два входа:

1. Результат Analyst Agent:
   - priorities;
   - quick wins;
   - defer list;
   - recommendations to Producer.

2. Исходный MVP-документ:
   - idea;
   - real case;
   - phase;
   - technologies;
   - MVP scope;
   - backlog;
   - constraints.

Главная цель Producer — сделать план достаточно маленьким, чтобы каждая задача могла выполняться со свежим контекстом.

---

## 1.3 Instructions

1. Прими входные данные:
   - Analyst Output;
   - Flight Search Frontend MVP document.

2. Не начинай писать код.

3. Сначала выдели главную цель текущей волны.

4. Раздели работу на маленькие задачи.

5. Каждая задача должна быть:
   - атомарной;
   - исполнимой отдельно;
   - проверяемой отдельно;
   - понятной без большого старого контекста;
   - подходящей для Vite + Vanilla JS + Tailwind CSS.

6. Если задача включает несколько разных действий — раздели её.

7. Если задача слишком большая — разбей её на меньшие.

8. Сохраняй приоритет Analyst Agent:
   - сначала структура проекта;
   - потом модель данных;
   - потом форма;
   - потом JavaScript-логика;
   - потом валидация;
   - потом mock results;
   - потом адаптивность и UI polish.

9. Не добавляй задачи, которые были явно отложены:
   - real flight API;
   - backend;
   - authentication;
   - payment;
   - search history;
   - advanced filters;
   - user accounts;
   - favorite routes.

10. Для каждой задачи укажи:
    - цель;
    - входные данные;
    - действие;
    - ожидаемый результат;
    - критерий проверки;
    - размер задачи.

11. В конце сделай Self-Check.

12. Передай результат Controller Agent со статусом `READY_FOR_REVIEW`.

13. Если Controller вернул `NEEDS_REVISION`:
    - исправь только указанные проблемы;
    - не переписывай весь план без необходимости;
    - создай новую версию плана;
    - снова передай Controller Agent.

14. Цикл повторяется до статуса `PASSED`.

---

# 2. Producer Input Data

Producer receives:

- Analyst Output v1
- Flight Search Frontend MVP document
- Real case: Boston → Istanbul → Saint Petersburg
- Required stop: Istanbul
- Departure range: 01 August 2026 – 10 August 2026
- Adults: 2, user configurable
- Min Layover: 3h
- Max Layover: 12h
- Currency: USD

---

# 3. Producer Output v1

## Project

Flight Search Frontend MVP

## Stack

Vite + Vanilla JS + Tailwind CSS

## Current Wave Goal

Создать маленький исполнимый план реализации MVP: сначала структура проекта, затем форма, JavaScript-логика, валидация и realistic mock results.

## Implementation Plan v1

### Task 1: Create Vite Project
**Goal:** создать базовый frontend-проект.  
**Action:** создать Vite Vanilla JS проект.  
**Expected Result:** проект запускается через `npm run dev`.  
**Check:** стартовая страница открывается в браузере.  
**Size:** Small

### Task 2: Configure Tailwind CSS
**Goal:** подключить Tailwind CSS.  
**Action:** установить и настроить Tailwind.  
**Expected Result:** Tailwind-классы работают в UI.  
**Check:** тестовый Tailwind-класс отображается корректно.  
**Size:** Small

### Task 3: Create Project Structure
**Goal:** подготовить чистую структуру файлов.  
**Action:** создать папки `src/components`, `src/data`, `src/utils`, `src/styles`.  
**Expected Result:** проект готов к модульной разработке.  
**Check:** структура понятная и не смешивает UI, данные и логику.  
**Size:** Small

### Task 4: Define Search Form Data Model
**Goal:** описать данные формы.  
**Action:** создать модель полей: `from`, `via`, `to`, `departureDate`, `dateRange`, `adults`, `minLayover`, `maxLayover`.  
**Expected Result:** форма имеет единую структуру данных.  
**Check:** все обязательные параметры маршрута представлены.  
**Size:** Small

### Task 5: Build Search Form UI
**Goal:** создать интерфейс формы.  
**Action:** добавить поля маршрута, даты, пассажиров и пересадки.  
**Expected Result:** пользователь видит понятную форму поиска.  
**Check:** все поля доступны и имеют label.  
**Size:** Medium

### Task 6: Add Form State Logic
**Goal:** подключить JavaScript-логику формы.  
**Action:** читать значения полей и собирать объект поиска.  
**Expected Result:** при submit создаётся search query object.  
**Check:** объект выводится в console или используется внутри приложения.  
**Size:** Medium

### Task 7: Add Validation
**Goal:** проверять ввод пользователя.  
**Action:** валидировать пустые поля, одинаковые города, adults, date range, min/max layover.  
**Expected Result:** ошибки показываются до поиска.  
**Check:** некорректные данные блокируют submit.  
**Size:** Medium

### Task 8: Create Realistic Mock Results
**Goal:** подготовить реалистичные данные авиабилетов.  
**Action:** создать mock data с airline, price USD, route, departure, arrival, layover, total duration.  
**Expected Result:** есть несколько realistic flight results для Boston → Istanbul → Saint Petersburg.  
**Check:** данные выглядят как реальные варианты билетов.  
**Size:** Medium

### Task 9: Render Result Cards
**Goal:** показать найденные рейсы.  
**Action:** создать карточки результатов на основе mock data.  
**Expected Result:** пользователь видит список маршрутов.  
**Check:** карточка показывает route, airline, price, dates, layover, duration.  
**Size:** Medium

### Task 10: Add Empty State
**Goal:** обработать отсутствие результатов.  
**Action:** показать понятное сообщение, если результатов нет.  
**Expected Result:** UI не выглядит сломанным без данных.  
**Check:** empty state появляется корректно.  
**Size:** Small

### Task 11: Add Responsive Layout
**Goal:** сделать UI удобным на mobile и desktop.  
**Action:** настроить Tailwind responsive classes.  
**Expected Result:** форма и результаты читаются на разных экранах.  
**Check:** проверить mobile и desktop width.  
**Size:** Medium

### Task 12: Final Cleanup
**Goal:** привести проект в аккуратное состояние.  
**Action:** удалить лишнее, проверить названия файлов, структуру и базовую читаемость кода.  
**Expected Result:** проект готов к Controller review.  
**Check:** проект запускается, структура чистая, нет очевидного мусора.  
**Size:** Small

## Send To Controller

Status: READY_FOR_REVIEW  
Version: v1

---

# 4. Controller Feedback v1

Controller returned:

```text
Status: NEEDS_REVISION
Required Action: revise the plan
```

## Problems To Fix

1. `Build Search Form UI` is too broad.
2. `Search/filter logic` task is missing.
3. `Create Project Structure` is too general.
4. `Add Validation` is too broad.

---

# 5. Producer Output v2

## Review Fixes Applied

1. Разделил `Build Search Form UI` на маленькие UI-задачи.
2. Добавил отдельную задачу `Create Search Matching Logic`.
3. Уточнил структуру файлов.
4. Разделил validation на отдельные группы.

---

## Approved Project Structure

```text
src/main.js

src/components/
  searchForm.js
  resultsList.js
  resultCard.js

src/data/
  mockFlights.js

src/utils/
  validation.js
  searchFlights.js

src/styles/
  input.css
```

---

## Implementation Plan v2

### Task 1: Create Vite Project

**Goal:** создать базовый Vite Vanilla JS проект.  
**Input:** project name and Vite Vanilla template.  
**Action:** initialize Vite project.  
**Expected Result:** project scaffold exists.  
**Check:** project runs with `npm run dev`.  
**Size:** Small

---

### Task 2: Configure Tailwind CSS

**Goal:** подключить Tailwind CSS.  
**Input:** Vite project.  
**Action:** install and configure Tailwind CSS.  
**Expected Result:** Tailwind classes work in the UI.  
**Check:** a test utility class renders correctly.  
**Size:** Small

---

### Task 3: Create Project File Structure

**Goal:** создать точную структуру файлов.  
**Input:** approved project structure.  
**Action:** create `components`, `data`, `utils`, and `styles` files.  
**Expected Result:** UI, data, and logic are separated.  
**Check:** all approved files exist.  
**Size:** Small

---

### Task 4: Define Search Form Data Model

**Goal:** описать поля формы.  
**Input:** required search parameters.  
**Action:** define search query object shape.  
**Expected Result:** form data has a predictable structure.  
**Fields:** `from`, `via`, `to`, `departureDate`, `dateRange`, `adults`, `minLayover`, `maxLayover`.  
**Check:** all required fields are represented.  
**Size:** Small

---

### Task 5: Build Route Fields UI

**Goal:** создать поля `From`, `Via`, `To`.  
**Input:** search form component.  
**Action:** add route input fields with labels.  
**Expected Result:** route section is visible and clear.  
**Check:** all route fields have labels and placeholders.  
**Size:** Small

---

### Task 6: Build Date and Adults Fields UI

**Goal:** создать поля даты, диапазона и взрослых.  
**Input:** search form component.  
**Action:** add departure date, date range, and adults fields.  
**Expected Result:** user can enter date range and adults count.  
**Check:** fields render correctly and can be changed.  
**Size:** Small

---

### Task 7: Build Layover Fields UI

**Goal:** создать поля min/max layover.  
**Input:** search form component.  
**Action:** add min and max layover hour fields.  
**Expected Result:** user can set layover range.  
**Check:** min and max layover values can be entered.  
**Size:** Small

---

### Task 8: Add Submit Button and Form Grouping

**Goal:** собрать форму в понятный UI.  
**Input:** route, date, adults, and layover fields.  
**Action:** group fields visually and add submit button.  
**Expected Result:** form is readable and usable.  
**Check:** user understands the form structure.  
**Size:** Small

---

### Task 9: Add Form State Logic

**Goal:** собирать search query object при submit.  
**Input:** form field values.  
**Action:** read form values and create query object.  
**Expected Result:** submit produces complete search query.  
**Check:** query object contains all form values.  
**Size:** Medium

---

### Task 10: Add Required Fields Validation

**Goal:** проверять пустые обязательные поля.  
**Input:** search query object.  
**Action:** validate required fields.  
**Expected Result:** empty required fields are rejected.  
**Check:** submit is blocked when required values are empty.  
**Size:** Small

---

### Task 11: Add Route Validation

**Goal:** проверить, что `from`, `via`, `to` не одинаковые.  
**Input:** route fields.  
**Action:** compare route values.  
**Expected Result:** duplicate route points are rejected.  
**Check:** identical cities show validation error.  
**Size:** Small

---

### Task 12: Add Passenger and Date Validation

**Goal:** проверить adults и date range.  
**Input:** adults and date fields.  
**Action:** validate adults minimum and valid date range.  
**Expected Result:** invalid adults/date data is rejected.  
**Check:** adults >= 1 and date range is valid.  
**Size:** Small

---

### Task 13: Add Layover Validation

**Goal:** проверить min/max layover.  
**Input:** layover fields.  
**Action:** validate min and max layover values.  
**Expected Result:** invalid layover range is rejected.  
**Check:** `minLayover` is not greater than `maxLayover`.  
**Size:** Small

---

### Task 14: Create Realistic Mock Results

**Goal:** создать mock flights.  
**Input:** real case route and realistic result fields.  
**Action:** create mock flight data.  
**Expected Result:** mock results look close to real flight search data.  
**Data:** airline, price USD, route, departure, arrival, layover, duration, adults support.  
**Check:** data includes multiple realistic route options.  
**Size:** Medium

---

### Task 15: Create Search Matching Logic

**Goal:** фильтровать mock results по форме.  
**Input:** search query object and mock flights.  
**Action:** compare query with mock results.  
**Expected Result:** only matching flights are returned.  
**Check:** search uses route, date range, adults, and min/max layover.  
**Size:** Medium

---

### Task 16: Render Result Cards

**Goal:** показать найденные рейсы.  
**Input:** filtered flight results.  
**Action:** render result cards.  
**Expected Result:** user sees matching flight results.  
**Check:** cards show route, airline, price, dates, layover, and duration.  
**Size:** Medium

---

### Task 17: Add Empty State

**Goal:** показать сообщение, если результатов нет.  
**Input:** empty search result array.  
**Action:** render empty state.  
**Expected Result:** UI explains that no results were found.  
**Check:** empty state works when search returns no results.  
**Size:** Small

---

### Task 18: Add Responsive Layout

**Goal:** адаптировать UI под mobile/desktop.  
**Input:** completed form and result cards.  
**Action:** add Tailwind responsive classes.  
**Expected Result:** form and results are readable on different screen sizes.  
**Check:** verify mobile and desktop layouts.  
**Size:** Medium

---

### Task 19: Final Cleanup

**Goal:** привести проект в чистое состояние.  
**Input:** completed MVP files.  
**Action:** clean unused code and verify naming.  
**Expected Result:** project is ready for implementation handoff.  
**Check:** project runs, structure is clean, no obvious clutter.  
**Size:** Small

---

## Not Included In This Wave

- real flight API
- backend
- authentication
- payment
- search history
- advanced filters
- user accounts
- favorite routes

---

## Self-Check v2

- [x] Каждая задача атомарная
- [x] Каждая задача проверяется отдельно
- [x] Нет задач Too Big
- [x] План соответствует Analyst Output
- [x] План соответствует MVP scope
- [x] План не включает отложенные функции
- [x] План исправляет все замечания Controller v1
- [x] План готов к проверке Controller Agent

---

## Send To Controller

Status: READY_FOR_REVIEW  
Version: v2

---

# 6. Final Producer Status

```text
Producer Output v2 created.
Status: REVIEWED_AND_APPROVED_BY_CONTROLLER
Next Step: Start Wave 1 in Windsurf
```
