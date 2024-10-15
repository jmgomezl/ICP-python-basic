export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'advance_level' : IDL.Func([IDL.Principal], [IDL.Text], []),
    'get_leaderboard' : IDL.Func([], [IDL.Text], ['query']),
    'get_player_rewards' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Vec(IDL.Text))],
        ['query'],
      ),
    'get_player_statistics' : IDL.Func([IDL.Principal], [IDL.Text], ['query']),
    'join_game' : IDL.Func([IDL.Principal], [IDL.Text], []),
    'set_bet' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    'withdraw_rewards' : IDL.Func([IDL.Principal], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
