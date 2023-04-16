package com.daniel.battleship.mapper.base;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public interface BaseMapper<T, V> {

	public T toEntity(V param);
	
	public V toDTO(T param);
	
	public default List<T> toListEntity(List<V> paramList) {
		if (Objects.isNull(paramList)) {
			return Collections.emptyList();
		}
		return paramList.stream().map(this::toEntity).collect(Collectors.toList());
	}

	public default List<V> toListDTO(List<T> paramList) {
		if (Objects.isNull(paramList)) {
			return Collections.emptyList();
		}
		return paramList.stream().map(this::toDTO).collect(Collectors.toList());
	}
}
