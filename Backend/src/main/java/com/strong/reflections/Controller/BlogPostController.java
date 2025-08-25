package com.strong.reflections.Controller;

import com.strong.reflections.Model.BlogPost;
import com.strong.reflections.Model.ResponseWrapper;
import com.strong.reflections.Service.BlogPostService;
import com.strong.reflections.Utils.ReflectException;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/blogposts")
public class BlogPostController {

    private final BlogPostService blogPostService;

    public BlogPostController(BlogPostService blogPostService) {
        this.blogPostService = blogPostService;
    }

    @GetMapping
    public ResponseEntity<ResponseWrapper<List<BlogPost>>> getAllBlogPosts() {
        List<BlogPost> blogPosts = blogPostService.getAllBlogPosts();
        return ResponseEntity
                .ok(new ResponseWrapper<>(HttpStatus.OK.value(), "Successfully retrieved all blog posts.", blogPosts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseWrapper<BlogPost>> getBlogPostById(@PathVariable UUID id) throws ReflectException {
        BlogPost blogPost = blogPostService.getBlogPostById(id);
        return ResponseEntity
                .ok(new ResponseWrapper<>(HttpStatus.OK.value(), "Successfully retrieved blog post.", blogPost));
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<ResponseWrapper<List<BlogPost>>> getBlogPostsByAuthorId(@PathVariable UUID authorId) {
        List<BlogPost> blogPosts = blogPostService.getBlogPostsByAuthorId(authorId);
        return ResponseEntity.ok(new ResponseWrapper<>(HttpStatus.OK.value(),
                "Successfully retrieved blog posts by author.", blogPosts));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseWrapper<BlogPost>> createBlogPost(@Valid @RequestBody BlogPost blogPost) {
        try {

            BlogPost createdBlogPost = blogPostService.createBlogPost(blogPost);
            return ResponseEntity.created(URI.create("/api/blogposts/" + createdBlogPost.getId()))
                    .body(new ResponseWrapper<>(HttpStatus.CREATED.value(), "Blog post created successfully.",
                            createdBlogPost));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseWrapper<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Error creating blog post: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("@blogPostService.getBlogPostById(#id) != null and @blogPostService.getBlogPostById(#id).author.id == authentication.principal.id")
    public ResponseEntity<ResponseWrapper<BlogPost>> updateBlogPost(@PathVariable UUID id,
            @Valid @RequestBody BlogPost blogPost) {
        try {
            BlogPost updatedBlogPost = blogPostService.updateBlogPost(id, blogPost);
            return ResponseEntity.ok(
                    new ResponseWrapper<>(HttpStatus.OK.value(), "Blog post updated successfully.", updatedBlogPost));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseWrapper<>(HttpStatus.NOT_FOUND.value(),
                            "Blog post not found or error updating: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@blogPostService.getBlogPostById(#id).author.id == authentication.principal.id")
    public ResponseEntity<ResponseWrapper<Void>> deleteBlogPost(@PathVariable UUID id) throws ReflectException {
        try {
            blogPostService.deleteBlogPost(id);
            return ResponseEntity
                    .ok(new ResponseWrapper<>(HttpStatus.OK.value(), "Blog post deleted successfully.", null));
        } catch (ReflectException e) {
            return ResponseEntity.status(e.getStatus())
                    .body(new ResponseWrapper<>(e.getStatus().value(), e.getMessage(), null));
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseWrapper<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        return ResponseEntity.badRequest()
                .body(new ResponseWrapper<>(HttpStatus.BAD_REQUEST.value(), "Validation failed", errors));
    }
}