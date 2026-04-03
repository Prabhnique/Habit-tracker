const STORAGE_KEY = "habit-tracker-app-state";

const habitForm = document.querySelector(".habit-form");
const habitInput = document.querySelector("#habit-name");
const inlineMessage = document.querySelector(".inline-message");
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

function createHabit(name) {
  return {
    id: crypto.randomUUID(),
    name,
    completedToday: false,
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

function showInlineMessage(message) {
  inlineMessage.textContent = message;
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

function persistAndRender(nextState) {
  const saveSucceeded = saveState(nextState);
  appState = nextState;
  renderHabitList(appState.habits);

  if (saveSucceeded) {
    showStorageMessage("");
  }
}

function recoverWithEmptyState(message) {
  const emptyState = getEmptyState();
  showStorageMessage(message);
  saveState(emptyState);
  return emptyState;
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
    return recoverWithEmptyState(
      "Saved data was unavailable, so the app started with an empty list."
    );
  }
}

function hasDuplicateHabitName(habits, candidateName) {
  const normalizedName = candidateName.toLowerCase();
  return habits.some((habit) => habit.name.toLowerCase() === normalizedName);
}

function validateHabitName(rawName, habits) {
  const trimmedName = rawName.trim();

  if (!trimmedName) {
    return {
      error: "Enter a habit name.",
      value: "",
    };
  }

  if (hasDuplicateHabitName(habits, trimmedName)) {
    return {
      error: "That habit already exists.",
      value: trimmedName,
    };
  }

  return {
    error: "",
    value: trimmedName,
  };
}

function buildHabitListItem(habit) {
  const item = document.createElement("li");
  item.className = "habit-item";
  item.dataset.habitId = habit.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = habit.completedToday;
  checkbox.className = "habit-checkbox";
  checkbox.setAttribute("aria-label", `${habit.name} completion status`);

  const name = document.createElement("span");
  name.className = "habit-name";
  name.textContent = habit.name;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete ${habit.name}`);

  item.append(checkbox, name, deleteButton);
  return item;
}

function renderHabitList(habits) {
  habitList.innerHTML = "";
  habits.forEach((habit) => {
    habitList.append(buildHabitListItem(habit));
  });
  emptyState.hidden = habits.length > 0;
}

function updateHabits(updateFn) {
  const nextState = {
    ...appState,
    habits: updateFn(appState.habits),
  };
  persistAndRender(nextState);
}

function getHabitIdFromTarget(target) {
  const habitItem = target.closest(".habit-item");
  return habitItem?.dataset.habitId ?? "";
}

let appState = loadState();
renderHabitList(appState.habits);

habitForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const validation = validateHabitName(habitInput.value, appState.habits);

  if (validation.error) {
    showInlineMessage(validation.error);
    habitInput.focus();
    return;
  }

  updateHabits((habits) => [...habits, createHabit(validation.value)]);
  showInlineMessage("");
  habitInput.value = "";
  habitInput.focus();
});

habitList.addEventListener("change", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement) || !target.classList.contains("habit-checkbox")) {
    return;
  }

  const habitId = getHabitIdFromTarget(target);
  if (!habitId) {
    return;
  }

  updateHabits((habits) =>
    habits.map((habit) =>
      habit.id === habitId ? { ...habit, completedToday: target.checked } : habit
    )
  );
});

habitList.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement) || !target.classList.contains("delete-button")) {
    return;
  }

  const habitId = getHabitIdFromTarget(target);
  if (!habitId) {
    return;
  }

  const habitToDelete = appState.habits.find((habit) => habit.id === habitId);

  if (!habitToDelete) {
    return;
  }

  const confirmed = window.confirm(`Delete "${habitToDelete.name}"?`);

  if (!confirmed) {
    return;
  }

  updateHabits((habits) => habits.filter((habit) => habit.id !== habitToDelete.id));
});
