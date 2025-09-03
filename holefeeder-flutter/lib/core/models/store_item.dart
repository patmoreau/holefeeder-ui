class StoreItem {
  final String id;
  final String code;
  final String data;

  const StoreItem({required this.id, required this.code, required this.data});

  factory StoreItem.fromJson(Map<String, dynamic> json) {
    return StoreItem(
      id: json['id'] as String,
      code: json['code'] as String,
      data: json['data'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'code': code, 'data': data};
  }
}
