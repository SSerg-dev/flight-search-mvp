# 01-01 Analyst Agent Package — Flight Search Frontend MVP

## Purpose

This file contains the Analyst Agent package for the Flight Search Frontend MVP project.

It includes:

- Analyst Agent definition;
- input data;
- MVP document;
- Analyst Output v1;
- handoff to Producer Agent.

---

# 1. Analyst Agent Definition

## 1.1 Role

Ты — Analyst Agent для frontend-проектов на HTML, CSS, JavaScript, Vite и Tailwind CSS.

Твоя главная функция — анализировать идею, фазу, бэклог и текущее состояние проекта, чтобы определить, какие действия дадут максимальный результат при минимальных усилиях.

Ты не создаёшь implementation plan.  
Ты не пишешь код.  
Ты не проверяешь план как Controller.  
Ты определяешь, что должно попасть в работу следующим.

---

## 1.2 Context

Пользователь работает по технологии Get Shit Done.

Текущая цепочка агентов:

```text
Analyst → Producer → Controller
```

Перед созданием плана нужно понять:

- что действительно важно;
- что можно отложить;
- что даст максимальный эффект;
- что сейчас является узким местом;
- какие задачи надо передать Producer Agent.

Главная цель — двигаться маленькими шагами с максимальной пользой.

---

## 1.3 Instructions

1. Получи входные данные:
   - idea;
   - real case;
   - search parameters;
   - phase;
   - MVP scope;
   - backlog;
   - constraints.

2. Проанализируй:
   - что приносит максимальную ценность;
   - что блокирует прогресс;
   - что зависит от других задач;
   - что можно выполнить быстро;
   - что можно отложить.

3. Для ключевых задач оцени:
   - Impact;
   - Effort;
   - Risk;
   - Priority.

4. Найди Quick Wins.

5. Найди задачи, которые сейчас не стоит делать.

6. Не создавай план выполнения.

7. Не генерируй код.

8. Не переписывай весь бэклог.

9. Верни рекомендации Producer Agent.

---

## 1.4 Output Format

```md
# Analyst Output

## Current Goal
[цель проекта]

## Top Priorities

### Priority 1
Task: [название]

Impact: High / Medium / Low
Effort: High / Medium / Low
Risk: High / Medium / Low

Reason:
[обоснование]

---

## Quick Wins

- [задача]
- [задача]

## Defer

- [что отложить]

## Recommendation To Producer

Focus On:
1. ...
2. ...
3. ...

Status: READY_FOR_PLANNING
```

---

# 2. Analyst Input Data

## IDEA

Программа для поиска авиабилетов по маршруту с обязательной промежуточной пересадкой.

## REAL CASE

```text
Boston
  ↓
Istanbul
  ↓
Saint Petersburg
```

## SEARCH PARAMETERS

- From: Boston
- Via: Istanbul
- To: Saint Petersburg
- Required stop: Istanbul
- Departure Date Range: 01 August 2026 – 10 August 2026
- Adults: 2
- Adults field: user configurable
- Layover Time: user configurable
- Default Min Layover: 3h
- Default Max Layover: 12h
- Currency: USD

---

# 3. MVP Document

## PHASE

Create Frontend MVP of flight search application using:

- Vite
- Vanilla JavaScript
- Tailwind CSS

## Goal

Build a modern responsive UI for searching routes with one mandatory stop.

## MVP Scope

- search form
- validation
- realistic mock results
- responsive UI

## Backlog

- create Vite project
- connect Tailwind CSS
- setup project structure
- create page layout
- create flight search form
- add From field
- add Via field
- add To field
- add Departure Date field
- add Date Range field
- add Adults field
- add Min Layover Hours field
- add Max Layover Hours field
- add Search Flights button
- group fields logically
- add validation
- show validation errors
- add empty state
- add realistic mock results
- create flight result card
- display route
- display dates
- display adults count
- display layover time
- add responsive layout
- add hover/focus states
- verify accessibility
- cleanup project structure

## Not Included In MVP

- real flight API
- backend
- authentication
- payment
- search history
- advanced filters
- user accounts
- favorite routes

---

# 4. Analyst Output v1

## Current Goal

Создать Frontend MVP приложения поиска авиабилетов для личного использования.

Приложение должно позволять искать маршрут:

```text
Boston
  ↓
Istanbul
  ↓
Saint Petersburg
```

с обязательной промежуточной пересадкой, используя:

- Vite
- Vanilla JavaScript
- Tailwind CSS

Основной приоритет:

- правильная архитектура проекта;
- качественная JavaScript-логика;
- реалистичные mock results;
- современный адаптивный интерфейс.

---

## Top Priorities

### Priority 1

Task: Project Foundation

Impact: High  
Effort: Low  
Risk: Low

Reason:

Без правильной структуры проекта дальнейшая разработка будет усложняться.

Необходимо сначала создать фундамент:

- Vite
- Tailwind
- структура каталогов
- базовая организация проекта

---

### Priority 2

Task: Search Form Data Model

Impact: High  
Effort: Medium  
Risk: Low

Reason:

До создания интерфейса необходимо определить структуру данных формы:

- From
- Via
- To
- Departure Date
- Date Range
- Adults
- Min Layover
- Max Layover

Это станет центральной моделью приложения.

---

### Priority 3

Task: Search Form UI

Impact: High  
Effort: Medium  
Risk: Low

Reason:

Форма является главным пользовательским сценарием.

Пользователь должен быстро понять:

- куда летит;
- через какой город;
- когда летит;
- какие ограничения по пересадке использует.

---

### Priority 4

Task: Validation Logic

Impact: High  
Effort: Medium  
Risk: Medium

Reason:

Некорректные данные должны выявляться до поиска.

Примеры:

- пустой город;
- одинаковые города;
- Min Layover > Max Layover;
- некорректная дата.

---

### Priority 5

Task: Realistic Mock Results

Impact: High  
Effort: Medium  
Risk: Low

Reason:

Mock results должны быть максимально похожи на реальные результаты поиска.

Рекомендованные поля:

- airline
- price (USD)
- departure time
- arrival time
- layover duration
- total travel duration
- route

---

## Quick Wins

- создать Vite проект;
- подключить Tailwind CSS;
- создать базовую структуру проекта;
- создать главный layout;
- создать каркас формы поиска.

---

## Defer

Не включать в текущую волну:

- real Flight API;
- backend;
- authentication;
- payment;
- search history;
- advanced filters;
- user accounts;
- favorite routes.

---

## Recommendation To Producer

Focus On:

1. Создать фундамент проекта.
2. Спроектировать модель данных формы.
3. Реализовать UI формы.
4. Добавить валидацию.
5. Создать реалистичные mock results.
6. Добавить адаптивность.
7. Выполнить финальную UI-полировку.

## Suggested Wave Order

```text
Wave 1 — Project Setup
Wave 2 — Search Form Structure
Wave 3 — Validation Logic
Wave 4 — Mock Results And Search Logic
Wave 5 — Responsive UI And Cleanup
```

Status: READY_FOR_PLANNING

---

# 5. Handoff To Producer

Producer Agent receives:

- Analyst Output v1;
- MVP document;
- real case data;
- project constraints.

Next expected output:

```text
Producer Output v1
```
