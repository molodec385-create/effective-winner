// ===== CHEST FARM MODE =====
// Быстрые раунды (5 сек) с выдачей сундуков

// Подключаем модуль фарма
#include "chest_farm.js"

// Создаем 2 команды (обязательно для режима)
Teams.Add("Team1", "Teams/Blue", { b: 1 });
Teams.Add("Team2", "Teams/Red", { r: 1 });

// Автоматически добавляем игроков и спавним
Teams.OnRequestJoinTeam.Add(function(player, team) { 
  team.Add(player); 
});
Teams.OnPlayerChangeTeam.Add(function(player) { 
  player.Spawns.Spawn(); 
});

// Получаем команды
var team1 = Teams.Get("Team1");
var team2 = Teams.Get("Team2");

// Настраиваем группы спавнов
team1.Spawns.SpawnPointsGroups.Add(1);
team2.Spawns.SpawnPointsGroups.Add(2);

// Включаем моментальный респавн
Spawns.GetContext().RespawnTime.Value = 0;

// Выключаем все оружие
var inv = Inventory.GetContext();
inv.Main.Value = false;
inv.Secondary.Value = false;
inv.Melee.Value = false;
inv.Explosive.Value = false;
inv.Build.Value = false;

// Выключаем урон
Damage.GetContext().DamageOut.Value = false;

// Инициализируем режим фарма
ChestFarm.Init();

// Запускаем режим
ChestFarm.Start();

// UI подсказка
Ui.GetContext().Hint.Value = "Chest Farm - Получайте сундуки каждые 5 секунд!";
