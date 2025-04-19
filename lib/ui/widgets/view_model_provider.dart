import 'package:flutter/material.dart';
import 'package:holefeeder/core/view_models/base_view_model.dart';
import 'package:provider/provider.dart';

class ViewModelProvider<T extends BaseViewModel> extends StatelessWidget {
  final T Function(BuildContext context) create;
  final Widget Function(T model) builder;

  const ViewModelProvider({
    super.key,
    required this.create,
    required this.builder,
  });

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<T>(
      create: (BuildContext ctx) => create(ctx),
      child: Consumer<T>(builder: (context, T value, child) => builder(value)),
    );
  }
}
