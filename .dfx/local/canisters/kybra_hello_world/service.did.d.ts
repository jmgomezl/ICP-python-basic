import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'advance_level' : ActorMethod<[Principal], string>,
  'get_leaderboard' : ActorMethod<[], string>,
  'get_player_rewards' : ActorMethod<[Principal], [] | [Array<string>]>,
  'get_player_statistics' : ActorMethod<[Principal], string>,
  'join_game' : ActorMethod<[Principal], string>,
  'set_bet' : ActorMethod<[Principal, bigint], string>,
  'withdraw_rewards' : ActorMethod<[Principal], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
