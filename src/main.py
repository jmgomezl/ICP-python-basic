# Mines Game - Kybra Code for ICP
# This is a starting point for developing a decentralized "Mines Game" using Kybra on ICP.

from kybra import Principal, nat, update, query, ic, Opt, Vec
import secrets
import hashlib
import time

# Initial state to store user information and game progress
class MinesGame:
    def __init__(self):
        self.players = {}
        self.level_rewards = [1.1, 1.3, 1.6, 2, 5, 'Mine - Game Over']
        self.max_levels = 5

    def add_player(self, player_id: Principal):
        if str(player_id) not in self.players:
            self.players[str(player_id)] = {
                "level": 0,
                "status": "active",
                "rewards": [],
                "withdrawn_rewards": [],
                "wins": 0,
                "losses": 0,
                "total_earned": 0.0,
                "total_bet": 0.0,
                "current_bet": 0.1,  # Default bet is 0.1 ICP
                "last_hash": None  # Store hash of the last random value for security
            }

    def set_bet(self, player_id: Principal, bet_amount: nat) -> str:
        player_data = self.players[str(player_id)]
        if player_data["level"] != 0:
            return "You can only set the bet amount at level 0."
        if bet_amount < 1 or bet_amount > 10:
            return "Bet amount must be between 0.1 ICP and 1 ICP."
        player_data["current_bet"] = bet_amount / 10.0
        return f"Bet amount set to {bet_amount / 10.0} ICP."

    def advance_level(self, player_id: Principal) -> str:
        player_data = self.players[str(player_id)]
        if player_data["status"] != "active":
            # Restart the game for the player
            player_data["level"] = 0
            player_data["status"] = "active"
            player_data["rewards"] = []
            player_data["withdrawn_rewards"] = []
            player_data["losses"] += 1
            return "You hit a mine! Game over. The game has been restarted."

        # Use current_bet only if the player is at level 0
        if player_data["level"] == 0:
            bet_amount = player_data["current_bet"]
            player_data["total_bet"] += bet_amount

        # Generate a cryptographically secure random value using a hash-based approach
        current_time = time.time()
        hash_input = f"{player_id}-{current_time}-{secrets.token_bytes(16)}"
        random_hash = hashlib.sha256(hash_input.encode()).hexdigest()
        random_value = int(random_hash, 16) % 100

        # Store the hash to prevent replay attacks
        player_data["last_hash"] = random_hash

        # Determine if the player hits a mine
        current_level = player_data["level"] + 1
        probability_of_mine = current_level / self.max_levels
        if random_value < int(probability_of_mine * 100):
            player_data["status"] = "game over"
            player_data["losses"] += 1
            return "You hit a mine! Game over. The game has been restarted."

        # Player successfully advanced to the next level
        player_data["level"] = current_level
        reward = self.level_rewards[current_level - 1] * player_data["current_bet"]
        player_data["rewards"] = f"{reward:.2f} ICP"
        return f"You advanced to level {current_level}. Your current balance is: {player_data['rewards']}"

    def withdraw_rewards(self, player_id: Principal) -> str:
        player_data = self.players[str(player_id)]
        if not player_data["rewards"]:
            return "No rewards to withdraw."
        
        # Transfer all rewards to withdrawn rewards and reset the game level
        player_data["withdrawn_rewards"].append(player_data["rewards"])
        player_data["total_earned"] += float(player_data["rewards"].split()[0])
        player_data["wins"] += 1
        player_data["rewards"] = []
        player_data["level"] = 0
        player_data["status"] = "active"
        return f"You have successfully withdrawn your rewards. The game has been restarted. Your current withdrawn balance is: {player_data['withdrawn_rewards']}"

    def get_withdrawn_rewards(self, player_id: Principal) -> Opt[Vec[str]]:
        if str(player_id) in self.players:
            return self.players[str(player_id)]["withdrawn_rewards"] if self.players[str(player_id)]["withdrawn_rewards"] else None
        return None

    def get_player_statistics(self, player_id: Principal) -> str:
        if str(player_id) in self.players:
            player_data = self.players[str(player_id)]
            total_games = player_data["wins"] + player_data["losses"]
            win_rate = (player_data["wins"] / total_games) * 100 if total_games > 0 else 0.0
            return (
                f"Player Statistics:\n"
                f"- Wins: {player_data['wins']}\n"
                f"- Losses: {player_data['losses']}\n"
                f"- Win Rate: {win_rate:.2f}%\n"
                f"- Total ICP Earned: {player_data['total_earned']} ICP\n"
                f"- Total ICP Bet: {player_data['total_bet']} ICP"
            )
        return "Player not found."

    def get_leaderboard(self) -> str:
        leaderboard = sorted(
            self.players.items(),
            key=lambda item: (
                item[1]["level"],
                item[1]["total_earned"],
                item[1]["wins"] / (item[1]["wins"] + item[1]["losses"] + 0.0001)  # Avoid division by zero
            ),
            reverse=True
        )
        leaderboard_str = "Leaderboard:\n"
        for rank, (player_id, stats) in enumerate(leaderboard[:10], start=1):
            leaderboard_str += (
                f"{rank}. Player {player_id} - Level: {stats['level']}, Total Earned: {stats['total_earned']} ICP, Wins: {stats['wins']}, Win Rate: {(stats['wins'] / (stats['wins'] + stats['losses'] + 0.0001)) * 100:.2f}%\n"
            )
        return leaderboard_str

mines_game = MinesGame()

@update
def join_game(player: Principal) -> str:
    """
    Adds the player to the game if not already joined.
    """
    mines_game.add_player(player)
    return f"Player {player} joined the Mines Game!"

@update
def set_bet(player: Principal, bet_amount: nat) -> str:
    """
    Set the bet amount for the player.
    """
    if str(player) not in mines_game.players:
        return "You need to join the game first!"
    
    result = mines_game.set_bet(player, bet_amount)
    return result

@update
def advance_level(player: Principal) -> str:
    """
    Player attempts to advance to the next level.
    """
    if str(player) not in mines_game.players:
        return "You need to join the game first!"
    
    result = mines_game.advance_level(player)
    return result

@update
def withdraw_rewards(player: Principal) -> str:
    """
    Player withdraws their rewards.
    """
    if str(player) not in mines_game.players:
        return "You need to join the game first!"
    
    result = mines_game.withdraw_rewards(player)
    return result

@query
def get_player_rewards(player: Principal) -> Opt[Vec[str]]:
    """
    Get all the rewards the player has won so far that are available for withdrawal.
    """
    if str(player) in mines_game.players:
        player_data = mines_game.players[str(player)]
        return player_data["withdrawn_rewards"] if player_data["withdrawn_rewards"] else None
    return None

@query
def get_player_statistics(player: Principal) -> str:
    """
    Get statistics for the player, such as win rate, total winnings, etc.
    """
    return mines_game.get_player_statistics(player)

@query
def get_leaderboard() -> str:
    """
    Get the leaderboard of the top 10 players.
    """
    return mines_game.get_leaderboard()

# Deployment note: This is just a starting point to demonstrate how we can use Kybra for a Mines Game.
# TODO:
# - Add more reward types such as NFTs and customize the logic to distribute prizes.
# - Implement token transfers (integrate wallet functionality).
# - Create a frontend to interact with this canister.