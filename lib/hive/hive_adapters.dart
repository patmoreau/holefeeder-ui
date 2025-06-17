import 'package:decimal/decimal.dart';
import 'package:hive_ce/hive.dart';
import 'package:holefeeder/core/enums/enums.dart';
import 'package:holefeeder/core/models/models.dart';

part 'hive_adapters.g.dart';

@GenerateAdapters([
  AdapterSpec<Account>(),
  AdapterSpec<AccountInfo>(),
  AdapterSpec<AccountType>(),
  AdapterSpec<Category>(),
  AdapterSpec<CategoryInfo>(),
  AdapterSpec<CategoryType>(),
  AdapterSpec<DateIntervalType>(),
  AdapterSpec<Upcoming>(),
  AdapterSpec<UserSettings>(),
  AdapterSpec<Tag>(),
  AdapterSpec<Transaction>(),
])
class HiveAdapters {}
