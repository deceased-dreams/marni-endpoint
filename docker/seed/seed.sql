BEGIN;
DELETE FROM bb_look_up WHERE 1;

LOAD DATA LOCAL INFILE '/seed/bb_lookup_p.csv'
  INTO TABLE bb_look_up
  FIELDS TERMINATED BY ','
  (umur, _min_3, _min_2, _min_1, _med, _plus_1, _plus_2, _plus_3)
  SET sex = "PEREMPUAN";

LOAD DATA LOCAL INFILE '/seed/bb_lookup_l.csv'
  INTO TABLE bb_look_up
  FIELDS TERMINATED BY ','
  (umur, _min_3, _min_2, _min_1, _med, _plus_1, _plus_2, _plus_3)
  SET sex = "LAKI_LAKI";
COMMIT;