package com.daniel.battleship.service.base;

import java.util.List;

public interface BaseService<T, ID> {

	T save(T item);
	
	T update(T item);
	
	void delete(T item);
	
	T getById(ID id);
	
	List<T> getAll();
	
}
