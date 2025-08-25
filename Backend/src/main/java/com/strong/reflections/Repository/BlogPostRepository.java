package com.strong.reflections.Repository;

import com.strong.reflections.Model.BlogPost;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogPostRepository extends JpaRepository<BlogPost, UUID> {
    List<BlogPost> findByAuthorId(UUID authorId);
}