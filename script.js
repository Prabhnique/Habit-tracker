const STORAGE_KEY = "habit-tracker-app-state";

const habitList = document.querySelector(".habit-list");
const emptyState = document.querySelector(".empty-state");
const storageMessage = document.querySelector(".storage-message");

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getEmptyState() {
  return {
    habits: [],
    lastSeenDate: getLocalDateKey(),
  };
}

function normalizeState(rawState) {
  const habits = Array.isArray(rawState?.habits) ? rawState.habits : [];
  const normalizedHabits = habits
    .filter((habit) => typeof habit?.id === "string" && typeof habit?.name === "string")
    .map((habit) => ({
      id: habit.id,
      name: habit.name,
      completedToday: Boolean(habit.completedToday),
    }));

  const lastSeenDate =
    typeof rawState?.lastSeenDate === "string" && rawState.lastSeenDate
      ? rawState.lastSeenDate
      : getLocalDateKey();

  return {
    habits: normalizedHabits,
    lastSeenDate,
  };
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    showStorageMessage("Changes could not be saved in this browser session.");
    return false;
  }
}

function showStorageMessage(message) {
  storageMessage.textContent = message;
}

function applyDailyReset(state) {
  const today = getLocalDateKey();

  if (state.lastSeenDate === today) {
    return state;
  }

  return {
    lastSeenDate: today,
    habits: state.habits.map((habit) => ({
      ...habit,
      completedToday: false,
    })),
  };
}

function loadState() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (!savedState) {
      const emptyState = getEmptyState();
      saveState(emptyState);
      return emptyState;
    }

    const parsedState = JSON.parse(savedState);
    const normalizedState = normalizeState(parsedState);
    const resetState = applyDailyReset(normalizedState);

    if (
      resetState.lastSeenDate !== normalizedState.lastSeenDate ||
      JSON.stringify(resetState.habits) !== JSON.stringify(normalizedState.habits)
    ) {
      saveState(resetState);
    }

    return resetState;
  } catch (error) {
    showStorageMessage("Saved data was unavailable, so the app started with an empty list.");
    return getEmptyState();
  }
}

function renderHabitList(habits) {
  habitList.innerHTML = "";

  habits.forEach((habit) => {
    const item = document.createElement("li");
    item.className = "habit-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.completedToday;
    checkbox.disabled = true;
    checkbox.setAttribute("aria-label", `${habit.name} completion status`);

    const name = document.createElement("span");
    name.className = "habit-name";
    name.textContent = habit.name;

    item.append(checkbox, name);
    habitList.append(item);
  });

  emptyState.hidden = habits.length > 0;
}

const appState = loadState();
renderHabitList(appState.habits);
