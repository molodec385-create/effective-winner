/**
 * Chest Farm Mode
 * Режим фарма сундуков: раунды по 5 сек, выдача бронзовых/серебряных/золотых сундуков
 */

var ChestFarm = {
  // Конфигурация
  roundDuration: 5, // 5 секунд на раунд
  currentRound: 0,
  isRunning: false,
  mainTimer: null,

  // Вероятности выпадения
  dropChances: {
    bronze: 0.40,  // 40% - бронзовый
    silver: 0.35,  // 35% - серебряный
    gold: 0.15,    // 15% - золотой
    nothing: 0.10  // 10% - ничего
  },

  // Награды за сундуки
  rewards: {
    bronze: { coins: 100, color: "🥉" },
    silver: { coins: 250, color: "🥈" },
    gold: { coins: 500, color: "🥇" }
  },

  // Статистика
  stats: {
    bronze: 0,
    silver: 0,
    gold: 0,
    totalCoins: 0
  },

  // Инициализация режима
  Init: function() {
    console.log("[ChestFarm] Инициализация режима...");
    
    // Создаем главный таймер
    this.mainTimer = Timers.GetContext().Get("ChestFarmRound");
    
    // Обработчик конца раунда
    this.mainTimer.OnTimer.Add(function() {
      ChestFarm.EndRound();
    });
    
    console.log("[ChestFarm] Готово к запуску!");
  },

  // Запуск режима
  Start: function() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    console.log("[ChestFarm] РЕЖИМ ЗАПУЩЕН");
    
    // Стартуем первый раунд
    this.StartNextRound();
  },

  // Начать следующий раунд
  StartNextRound: function() {
    if (!this.isRunning) return;
    
    this.currentRound++;
    console.log("[ChestFarm] 🔵 Раунд #" + this.currentRound + " начался");
    
    // Запускаем таймер на 5 секунд (циклический)
    this.mainTimer.RestartLoop(this.roundDuration);
  },

  // Конец раунда - выдача сундука
  EndRound: function() {
    if (!ChestFarm.isRunning) return;
    
    console.log("[ChestFarm] ✅ Раунд завершен");
    
    // Выдаем сундук
    var chest = ChestFarm.GetRandomChest();
    if (chest) {
      ChestFarm.GiveChest(chest);
    }
    
    // Показываем статистику
    ChestFarm.ShowStats();
    
    // Продолжаем цикл
    ChestFarm.StartNextRound();
  },

  // Получить случайный сундук
  GetRandomChest: function() {
    var rand = Math.random();
    
    if (rand < this.dropChances.bronze) {
      return "bronze";
    } else if (rand < this.dropChances.bronze + this.dropChances.silver) {
      return "silver";
    } else if (rand < this.dropChances.bronze + this.dropChances.silver + this.dropChances.gold) {
      return "gold";
    }
    
    return null; // ничего
  },

  // Выдать сундук всем игрокам
  GiveChest: function(chestType) {
    var reward = this.rewards[chestType];
    if (!reward) return;
    
    var players = Players.All;
    
    for (var i = 0; i < players.length; i++) {
      var player = players[i];
      
      // Даем коины игроку через инвентарь
      player.Inventory.Coins.Value = (player.Inventory.Coins.Value || 0) + reward.coins;
      
      // Обновляем статистику
      if (!player.ChestStats) {
        player.ChestStats = { bronze: 0, silver: 0, gold: 0, totalCoins: 0 };
      }
      player.ChestStats[chestType]++;
      player.ChestStats.totalCoins += reward.coins;
    }
    
    // Глобальная статистика
    this.stats[chestType]++;
    this.stats.totalCoins += reward.coins * players.length;
    
    // Логируем
    console.log("[ChestFarm] " + reward.color + " СУНДУК " + chestType.toUpperCase() + 
                " -> +" + reward.coins + " коинов каждому");
  },

  // Показать статистику
  ShowStats: function() {
    var totalChests = this.stats.bronze + this.stats.silver + this.stats.gold;
    var players = Players.All;
    
    console.log("\n═══════════════════════════════════");
    console.log("📊 СТАТИСТИКА РАУНДА #" + this.currentRound);
    console.log("═══════════════════════════════════");
    console.log("🥉 Бронзовых:  " + this.stats.bronze);
    console.log("🥈 Серебряных: " + this.stats.silver);
    console.log("🥇 Золотых:    " + this.stats.gold);
    console.log("📦 Всего:      " + totalChests);
    console.log("💰 Коинов:     " + this.stats.totalCoins);
    console.log("👥 Игроков:    " + players.length);
    console.log("═══════════════════════════════════\n");
  },

  // Остановить режим
  Stop: function() {
    this.isRunning = false;
    this.mainTimer.Stop();
    console.log("[ChestFarm] Режим остановлен");
  }
};

// Expose для глобального доступа
if (typeof module !== 'undefined') module.exports = ChestFarm;
