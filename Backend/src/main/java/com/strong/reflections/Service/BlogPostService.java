package com.strong.reflections.Service;

import com.strong.reflections.Repository.BlogPostRepository;
import com.strong.reflections.Utils.ReflectException;

import java.util.List;
import java.util.Optional;
import com.strong.reflections.Model.BlogPost;
import org.springframework.http.HttpStatus;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class BlogPostService {

    private final BlogPostRepository blogPostRepository;

    public BlogPostService(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    public BlogPost createBlogPost(BlogPost blogPost) throws ReflectException {
        try {
            return blogPostRepository.save(blogPost);
        } catch (Exception e) {
            throw new ReflectException("Error creating blog post", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public List<BlogPost> getAllBlogPosts() {
        return blogPostRepository.findAll();
    }

    public BlogPost getBlogPostById(UUID id) throws ReflectException {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new ReflectException("Blog post not found with id: " + id, HttpStatus.NOT_FOUND));
    }

    public BlogPost updateBlogPost(UUID id, BlogPost updatedBlogPost) throws ReflectException {
        Optional<BlogPost> existingBlogPostOptional = blogPostRepository.findById(id);

        if (existingBlogPostOptional.isPresent()) {
            BlogPost existingBlogPost = existingBlogPostOptional.get();
            existingBlogPost.setTitle(updatedBlogPost.getTitle());
            existingBlogPost.setContent(updatedBlogPost.getContent());

            try {
                return blogPostRepository.save(existingBlogPost);
            } catch (Exception e) {
                throw new ReflectException("Error updating blog post with id: " + id, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            throw new ReflectException("Blog post not found with id: " + id, HttpStatus.NOT_FOUND);
        }
    }

    public void deleteBlogPost(UUID id) throws ReflectException {
        blogPostRepository.findById(id)
                .orElseThrow(() -> new ReflectException("Blog post not found with id: " + id, HttpStatus.NOT_FOUND));
        blogPostRepository.deleteById(id);
    }

    public List<BlogPost> getBlogPostsByAuthorId(UUID authorId) {
        return blogPostRepository.findByAuthorId(authorId);
    }
}