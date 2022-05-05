export interface MatchesPrototypesAttributes {
  id?: number;
  team_one: string;
  team_two: string;
  result_one?: number;
  result_two?: number;
  date_match?: Date;
  stadium?: string;
  fixture_id?: number;
}

export interface MatchesAttributes extends MatchesPrototypesAttributes {
  pronostic_one?: number;
  pronostic_two?: number;
  total_points?: number;
}
