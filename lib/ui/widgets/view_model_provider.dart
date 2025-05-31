import 'package:flutter/material.dart';
import 'package:holefeeder/core/view_models/base_view_model.dart';
import 'package:provider/provider.dart';

class ViewModelProvider<T extends BaseViewModel> extends StatelessWidget {
  final T Function(BuildContext context)? create;
  final T Function()? value;
  final Widget Function(T model) builder;

  const ViewModelProvider({
    super.key,
    this.create,
    this.value,
    required this.builder,
  }) : assert(
          create != null || value != null,
          'Either create or value must be provided',
        ),
        assert(
          !(create != null && value != null),
          'create and value cannot both be provided',
        );

  @override
  Widget build(BuildContext context) {
    if (create != null) {
      return ChangeNotifierProvider<T>(
        create: (BuildContext ctx) => create!(ctx),
        child: Consumer<T>(builder: (context, T value, child) => builder(value)),
      );
    } else {
      return ChangeNotifierProvider<T>.value(
        value: value!(),
        child: Consumer<T>(builder: (context, T value, child) => builder(value)),
      );
    }
  }
}
