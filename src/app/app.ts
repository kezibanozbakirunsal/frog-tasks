// src/app/app.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  name: string;
  deadline: string;
  count: number;   // units / workload
  done: boolean;   // completed?
  queued: boolean; // Scenario 7: queued for shipping?
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  tasks: Task[] = [
    {
      id: 1,
      name: 'Shop',
      deadline: '2025-11-27',
      count: 5,
      done: false,
      queued: false,
    },
    {
      id: 2,
      name: 'Work',
      deadline: '2025-11-27',
      count: 2,
      done: false,
      queued: false,
    },
    {
      id: 3,
      name: 'Prepare sprint planning board and estimation session for next release',
      deadline: '2025-11-27',
      count: 22,
      done: false,
      queued: false,
    },
  ];

  // 🐸 Frog images (public klasöründe)
  frogPending = '/frog-pending.jpg';
  frogDone = '/frog-done.jpg';

  // 🔍 Filtre / arama
  searchTerm = '';
  statusFilter: 'ALL' | 'Pending' | 'Completed' = 'ALL';

  // 📝 Form modeli (Add / Edit)
  model: { id?: number; name: string; deadline: string; count: number } = {
    name: '',
    deadline: '',
    count: 0,
  };

  editMode = false;
  nextId = 4;

  // Listeyi filtrele (tablo için)
  get filteredTasks(): Task[] {
    const term = this.searchTerm.toLowerCase();

    return this.tasks
      .filter((task) => task.name.toLowerCase().includes(term))
      .filter((task) => {
        if (this.statusFilter === 'ALL') return true;
        if (this.statusFilter === 'Pending') return !task.done;
        return task.done; // Completed
      });
  }

  // 🔢 Scenario 4–5–6: queued / workload hesapları
  // Artık "queued" = queued === true
  get queuedTasks(): Task[] {
    return this.tasks.filter((task) => task.queued);
  }

  get queuedCount(): number {
    return this.queuedTasks.length;
  }

  // Scenario 5: toplam units (count) → filter + reduce
  get totalUnits(): number {
    return this.queuedTasks.reduce((sum, task) => sum + task.count, 0);
  }

  // Scenario 4: i18nPlural için mapping
  queuedMap: { [k: string]: string } = {
    '=0': 'No tasks',
    '=1': 'One task',
    other: '# tasks',
  };

  // Scenario 7: queued durumunu değiştir (Add / Remove)
  toggleQueue(task: Task): void {
    task.queued = !task.queued;
  }

  // Add / Save
  addOrUpdateTask(): void {
    const name = this.model.name.trim();
    if (!name) return;

    if (this.editMode && this.model.id != null) {
      // UPDATE
      const index = this.tasks.findIndex((t) => t.id === this.model.id);
      if (index > -1) {
        this.tasks[index] = {
          ...this.tasks[index],
          name: this.model.name,
          deadline: this.model.deadline || this.tasks[index].deadline,
          count: this.model.count ?? this.tasks[index].count,
          // queued ve done alanları aynı kalsın
        };
      }
    } else {
      // ADD
      this.tasks.push({
        id: this.nextId++,
        name: this.model.name,
        deadline: this.model.deadline || '2025-11-27',
        count: this.model.count || 0,
        done: false,
        queued: false,
      });
    }

    this.resetForm();
  }

  editTask(task: Task): void {
    this.editMode = true;
    this.model = {
      id: task.id,
      name: task.name,
      deadline: task.deadline,
      count: task.count,
    };
  }

  deleteTask(task: Task): void {
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
    if (this.editMode && this.model.id === task.id) {
      this.resetForm();
    }
  }

  clearAll(): void {
    this.searchTerm = '';
    this.statusFilter = 'ALL';
    this.resetForm();
  }

  resetForm(): void {
    this.editMode = false;
    this.model = { name: '', deadline: '', count: 0 };
  }

  markDone(task: Task): void {
    task.done = !task.done;
  }
}
