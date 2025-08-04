import 'package:provider/provider.dart';

import 'event_bus.dart';

final eventProviders = [Provider<EventBus>(create: (context) => EventBus())];
