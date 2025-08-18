import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostCard from '../components/PostCard';

// Mock post data
const mockPost = {
  slug: 'test-post',
  title: 'Test Post Title',
  excerpt: 'This is a test excerpt for the post',
  date: '2025-08-01T10:00:00.000Z',
  tags: ['React', 'Testing'],
  cover: '/images/test-cover.jpg',
  content: 'Test content with some words to calculate reading time'
};

// Wrapper component for router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('PostCard', () => {
  test('renders post title and excerpt', () => {
    renderWithRouter(<PostCard post={mockPost} />);
    
    // Check if title is rendered
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    
    // Check if excerpt is rendered
    expect(screen.getByText('This is a test excerpt for the post')).toBeInTheDocument();
    
    // Check if tags are rendered
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Testing')).toBeInTheDocument();
    
    // Check if date is formatted and displayed
    expect(screen.getByText(/Aug/)).toBeInTheDocument();
    
    // Check if reading time is calculated and displayed
    expect(screen.getByText(/min read/)).toBeInTheDocument();
  });

  test('renders without excerpt when showExcerpt is false', () => {
    renderWithRouter(<PostCard post={mockPost} showExcerpt={false} />);
    
    // Title should still be there
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    
    // Excerpt should not be rendered
    expect(screen.queryByText('This is a test excerpt for the post')).not.toBeInTheDocument();
    
    // "Read more" link should not be there
    expect(screen.queryByText('Read more →')).not.toBeInTheDocument();
  });
});